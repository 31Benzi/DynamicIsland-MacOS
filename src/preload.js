const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('island', {
  resize: (width, height) => ipcRenderer.send('island:resize', { width, height }),
  getNowPlaying: () => ipcRenderer.invoke('media:get'),
  mediaCmd: (cmd) => ipcRenderer.send('media:cmd', cmd),
  onNowPlaying: (cb) => ipcRenderer.on('media:nowplaying', (_, data) => cb(data)),
  getClipboard: () => ipcRenderer.invoke('clipboard:get'),
  copyToClipboard: (text) => ipcRenderer.send('clipboard:copy', text),
  pinClipboard: (index, pinned) => ipcRenderer.send('clipboard:pin', { index, pinned }),
  deleteClipboard: (index) => ipcRenderer.send('clipboard:delete', index),
  onClipboardUpdate: (cb) => ipcRenderer.on('clipboard:update', (_, items) => cb(items)),
  onCharging: (cb) => ipcRenderer.on('system:charging', (_, data) => cb(data)),
  clearNotif: (idx) => ipcRenderer.send('notif:clear', idx),
  startDrag: (filepath) => ipcRenderer.send('drag:start', filepath),
  absorbFile: (filepath) => ipcRenderer.invoke('shelf:absorb', filepath),
  checkExists: (filepath) => ipcRenderer.invoke('shelf:check', filepath),
  getConfig: () => ipcRenderer.invoke('config:get'),
  saveConfig: (config) => ipcRenderer.send('config:save', config),
  openSettings: () => ipcRenderer.send('system:settings'),
  onShowSettings: (cb) => ipcRenderer.on('app:show-settings', () => cb()),
  onUpdateAvailable: (cb) => ipcRenderer.on('app:update-available', () => cb()),
  quitApp: () => ipcRenderer.send('app:quit')
})
