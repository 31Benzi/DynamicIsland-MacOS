# Dynamic Island for macOS

> A pill-shaped always-on-top overlay for macOS that shows your Spotify/Music now-playing info, clipboard history, a file shelf, and an AI assistant — built with Electron.

![macOS](https://img.shields.io/badge/macOS-12%2B-black?style=flat-square&logo=apple)
![Electron](https://img.shields.io/badge/Electron-29-blue?style=flat-square&logo=electron)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Features

| Tab | What it does |
|---|---|
| **Home** | Now-playing from Spotify or Music.app with live progress bar, album art, and media controls. Shows the current week's calendar and local weather. |
| **File Shelf** | Drag & drop files onto the island to hold them temporarily. Supports reference mode (keep original) or absorb mode (cut & paste). |
| **Clipboard** | Auto-captures every copy event. Click any entry to re-copy it instantly. |
| **AI** | Ask anything inline — powered by OpenRouter (configurable model). |

**Extras:**
- Hover the island to expand, mouse away to collapse — smooth spring animation
- Charging indicator flashes when you plug/unplug power
- `Cmd + Shift + I` to toggle visibility
- Always on top, lives above full-screen apps

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/dynamic-island-mac.git
cd dynamic-island-mac

# 2. Install dependencies
npm install

# 3. Set up your config (for the AI tab)
cp config.example.json config.json
# then edit config.json and add your OpenRouter API key

# 4. Run
npm run dev
```

The island appears at the top-center of your primary display.

---

## AI Setup (Optional)

The AI tab uses [OpenRouter](https://openrouter.ai/) so you can use any model.

1. Sign up at [openrouter.ai](https://openrouter.ai/) and copy your API key
2. In `config.json` (which is gitignored — your key stays local):

```json
{
  "OPENROUTER_API_KEY": "sk-or-v1-YOUR_KEY_HERE",
  "MODEL_NAME": "nvidia/nemotron-3-super-120b-a12b:free"
}
```

You can use any model from OpenRouter's catalog. Many have free tiers.

---

## Project Structure

```
dynamic-island-mac/
├── src/
│   ├── main.js         ← Electron main process (window, IPC, media polling, battery)
│   ├── preload.js      ← Secure contextBridge API
│   └── island.html     ← The entire pill UI + JS logic
├── icons/              ← App icon assets
├── config.example.json ← Template — copy to config.json and fill in your key
└── package.json
```

---

## Build for Distribution

```bash
npm run dist
```

Outputs a `.dmg` to `dist/`. Note: the app is not signed or notarized, so macOS will show a security warning on first launch. Right-click → Open to bypass it.

---

## Requirements

- macOS 12 Monterey or later
- Node.js 18+
- Spotify or Apple Music installed (for media controls)
- An OpenRouter API key (only needed for the AI tab)

---

## Roadmap

- [ ] Real macOS notifications via `NSUserNotification`
- [ ] Timer / Pomodoro widget
- [ ] System stats widget (CPU/RAM)
- [ ] Option-drag to reposition the island
- [ ] App signing & notarization for easier distribution

---

## License

MIT — do whatever you want, a star is appreciated ⭐
