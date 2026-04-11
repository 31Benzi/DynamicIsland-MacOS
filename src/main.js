const { app, BrowserWindow, ipcMain, screen, globalShortcut, clipboard, Tray, Menu, nativeImage, powerMonitor } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const shelfDir = path.join(app.getPath('userData'), 'ShelfHoldingArea')
const configPath = path.join(app.getPath('userData'), 'config.json')

try { fs.mkdirSync(shelfDir, { recursive: true }) } catch (e) {}

const IS_DEV = process.argv.includes('--dev')

let wasMenuBarHidden = false

function saveAndHideMenuBar() {
  try {
    const result = execSync('defaults read NSGlobalDomain _HIHideMenuBar 2>/dev/null', { encoding: 'utf8' }).trim()
    wasMenuBarHidden = result === '1'
  } catch (_) {
    wasMenuBarHidden = false
  }

  if (!wasMenuBarHidden) {
    try {
      execSync('defaults write NSGlobalDomain _HIHideMenuBar -bool true')
    } catch (_) {}
  }
}

function restoreMenuBar() {
  if (!wasMenuBarHidden) {
    try {
      execSync('defaults write NSGlobalDomain _HIHideMenuBar -bool false')
    } catch (_) {}
  }
}

function getPrimaryDisplay() {
  return screen.getPrimaryDisplay()
}

function calculateIslandPosition(windowWidth, windowHeight) {
  const primaryDisplay = getPrimaryDisplay()
  const { width: screenWidth } = primaryDisplay.size
  const centerX = Math.floor(primaryDisplay.bounds.x + (screenWidth / 2) - (windowWidth / 2))
  const topY = primaryDisplay.bounds.y
  return { x: centerX, y: topY }
}

let islandWin = null
let tray = null
let clipboardHistory = []
let lastClipboard = null
let clipboardPollInterval = null

function forceIslandToTop() {
  if (!islandWin) return
  const bounds = islandWin.getBounds()
  const { x, y } = calculateIslandPosition(bounds.width, bounds.height)
  islandWin.setAlwaysOnTop(true, 'pop-up-menu', 1)
  islandWin.setPosition(x, y)
}

function createIslandWindow() {
  const windowWidth = 170
  const windowHeight = 40
  const { x, y } = calculateIslandPosition(windowWidth, windowHeight)

  islandWin = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: x,
    y: y,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true,
    type: 'panel',
    visibleOnAllWorkspaces: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  islandWin.setAlwaysOnTop(true, 'pop-up-menu', 1)

  islandWin.loadFile(path.join(__dirname, 'island.html'))
  islandWin.setIgnoreMouseEvents(false)

  islandWin.setPosition(Math.floor(x), y)

  islandWin.once('ready-to-show', () => {
    const { x, y } = calculateIslandPosition(windowWidth, windowHeight)
    islandWin.setAlwaysOnTop(true, 'pop-up-menu', 1)
    islandWin.setBounds({ x, y, width: windowWidth, height: windowHeight }, false)
    islandWin.show()
    islandWin.setPosition(x, y)

    setTimeout(() => forceIslandToTop(), 100)
    setTimeout(() => forceIslandToTop(), 500)
  })

  if (!IS_DEV) {
    islandWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  }

  if (IS_DEV) {
    islandWin.webContents.openDevTools({ mode: 'detach' })
  }
}

function createTray() {
  const icon = nativeImage.createEmpty()
  tray = new Tray(icon)
  tray.setToolTip('Dynamic Island')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Show Island', click: () => islandWin?.show() },
    { label: 'Hide Island', click: () => islandWin?.hide() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]))
}

function startClipboardPolling() {
  clipboardPollInterval = setInterval(() => {
    let newItem = null;
    
    const text = clipboard.readText();
    if (text && text.trim().length > 0) {
      newItem = { type: 'text', content: text };
    } else {
      const img = clipboard.readImage();
      if (!img.isEmpty()) {
        newItem = { type: 'image', content: img.resize({ height: 100 }).toDataURL() };
      }
    }

    if (newItem) {
      if (!lastClipboard || lastClipboard.content !== newItem.content) {
        lastClipboard = newItem;
        clipboardHistory = [newItem, ...clipboardHistory.filter(c => c.content !== newItem.content)].slice(0, 10);
        islandWin?.webContents.send('clipboard:update', clipboardHistory);
      }
    }
  }, 800)
}

function getNowPlaying() {
  const scripts = {
    spotify: `
      if application "Spotify" is running then
        tell application "Spotify"
          set pState to player state as string
          if pState is "playing" or pState is "paused" then
            set tName to name of current track as string
            set tArtist to artist of current track as string
            set tArt to ""
            try
              set tArt to artwork url of current track as string
            end try
            set tPos to "0"
            try
              set tPos to player position as string
            end try
            set tDur to "1"
            try
              set tDur to duration of current track as string
            end try
            return tName & "|||" & tArtist & "|||" & pState & "|||" & tArt & "|||" & tPos & "|||" & tDur
          end if
        end tell
      end if
    `,
    music: `
      if application "Music" is running then
        tell application "Music"
          set pState to player state as string
          if pState is "playing" or pState is "paused" then
            set tName to name of current track as string
            set tArtist to artist of current track as string
            set tPos to "0"
            try
              set tPos to player position as string
            end try
            set tDur to "1"
            try
              set tDur to duration of current track as string
            end try
            return tName & "|||" & tArtist & "|||" & pState & "||||||" & tPos & "|||" & tDur
          end if
        end tell
      end if
    `,
  }

  for (const [app, script] of Object.entries(scripts)) {
    try {
      const result = execSync(`/usr/bin/osascript -e '${script}'`, {
        timeout: 1000,
        stdio: ['pipe', 'pipe', 'ignore'],
      }).toString().trim()

      if (result) {
        const parts = result.split('|||')
        const name = parts[0]
        const artist = parts[1]
        const state = parts[2]
        const artUrl = parts[3] ? parts[3].trim() : ''
        const pos = parts[4] ? parseFloat(parts[4]) : 0
        let dur = parts[5] ? parseFloat(parts[5]) : 1
        if (app === 'spotify') dur = dur / 1000 
        return { name, artist, state, url: artUrl, source: app, pos, dur }
      }
    } catch (_) {}
  }
  return null
}

function mediaCommand(cmd) {
  const spotifyScript = {
    play: `tell application "Spotify" to play`,
    pause: `tell application "Spotify" to pause`,
    next: `tell application "Spotify" to next track`,
    prev: `tell application "Spotify" to previous track`,
  }
  try {
    execSync(`osascript -e '${spotifyScript[cmd]}'`, { timeout: 1000, stdio: 'ignore' })
  } catch (_) {}
}

function registerIPC() {
  ipcMain.on('island:resize', (_, { width, height }) => {
    if (!islandWin) return
    const { x, y } = calculateIslandPosition(width, height)
    islandWin.setSize(width, height, false)
    islandWin.setAlwaysOnTop(true, 'pop-up-menu', 1)
    islandWin.setPosition(x, y)
    setTimeout(() => forceIslandToTop(), 50)
  })

  ipcMain.handle('media:get', () => getNowPlaying())
  ipcMain.on('media:cmd', (_, cmd) => mediaCommand(cmd))

  ipcMain.handle('clipboard:get', () => clipboardHistory)
  ipcMain.on('clipboard:copy', (_, item) => {
    if (typeof item === 'string') {
      clipboard.writeText(item)
    } else if (item.type === 'text') {
      clipboard.writeText(item.content)
    } else if (item.type === 'image') {
      clipboard.writeImage(nativeImage.createFromDataURL(item.content))
    }
  })

  ipcMain.on('notif:clear', (_, idx) => {})

  ipcMain.on('drag:start', async (event, filepath) => {
    try {
      const icon = await app.getFileIcon(filepath)
      event.sender.startDrag({
        file: filepath,
        icon: icon || nativeImage.createEmpty()
      })
    } catch(e) {
      event.sender.startDrag({ file: filepath, icon: nativeImage.createEmpty() })
    }
  })

  ipcMain.handle('shelf:absorb', async (event, sourcePath) => {
    try {
      if (!fs.existsSync(sourcePath)) return null;
      const filename = path.basename(sourcePath)
      
      const uniqueSubDir = path.join(shelfDir, Date.now().toString() + Math.floor(Math.random()*1000).toString())
      fs.mkdirSync(uniqueSubDir, { recursive: true })
      
      const destPath = path.join(uniqueSubDir, filename)
      
      try {
        fs.renameSync(sourcePath, destPath)
      } catch(e) {
        if (e.code === 'EXDEV') {
          fs.copyFileSync(sourcePath, destPath)
          fs.unlinkSync(sourcePath)
        } else {
          throw e
        }
      }
      return destPath
    } catch (err) {
      console.error(err)
      return null
    }
  })

  ipcMain.handle('shelf:check', async (event, filepath) => {
    try {
      return fs.existsSync(filepath)
    } catch(e) { return false }
  })

  ipcMain.handle('config:get', async () => {
    try {
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'))
      }
    } catch(e) {}
    return {}
  })

  ipcMain.on('system:settings', (event) => {

    event.sender.send('app:show-settings')
  })
  
  ipcMain.on('config:save', (_, config) => {
    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      applyLoginSettings(config)
    } catch(e) {
      console.error('Failed to save config:', e)
    }
  })

  autoUpdater.on('update-available', () => {
    islandWin?.webContents.send('app:update-available')
  })
}

function applyLoginSettings(config) {
  if (IS_DEV) return
  const startAtLogin = !!config.START_AT_LOGIN
  app.setLoginItemSettings({
    openAtLogin: startAtLogin,
    path: app.getPath('exe'),
  })
}

function registerShortcuts() {
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    if (islandWin?.isVisible()) {
      islandWin.hide()
    } else {
      islandWin?.show()
    }
  })
}

app.whenReady().then(() => {
  saveAndHideMenuBar()

  if (!IS_DEV) {
    autoUpdater.checkForUpdatesAndNotify()
  }

  setTimeout(() => {
    createIslandWindow()
    registerIPC()
    registerShortcuts()
    startClipboardPolling()
    
    function sendBatteryState() {
      try {
        const pmset = execSync('pmset -g batt').toString()
        const isPlugged = pmset.includes('AC Power')
        let percent = '100%'
        const match = pmset.match(/(\d+)%/)
        if (match) percent = match[1] + '%'
        
        if (isPlugged) {
          islandWin?.webContents.send('system:charging', { state: 'plugged', percent })
        } else {
          islandWin?.webContents.send('system:charging', { state: 'unplugged', percent })
        }
      } catch(e) {}
    }
    
    setTimeout(sendBatteryState, 2000)
    setInterval(sendBatteryState, 10000)
    
    powerMonitor.on('on-ac', sendBatteryState)
    powerMonitor.on('on-battery', sendBatteryState)

    setInterval(async () => {
      const track = getNowPlaying()
      islandWin?.webContents.send('media:nowplaying', track)
    }, 1000)

    screen.on('display-removed', () => forceIslandToTop())

    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        applyLoginSettings(config)
      } catch(e) {}
    }
  }, 600)
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
  clearInterval(clipboardPollInterval)
  restoreMenuBar()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
