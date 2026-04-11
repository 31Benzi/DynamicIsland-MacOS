# Dynamic Island for macOS

> A pill-shaped always-on-top overlay for macOS that shows your Spotify/Music now-playing info, persistent clipboard history, a file shelf, and an AI assistant — built with Electron.

![macOS](https://img.shields.io/badge/macOS-12%2B-black?style=flat-square&logo=apple)
![Electron](https://img.shields.io/badge/Electron-29-blue?style=flat-square&logo=electron)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Features

| Tab | What it does |
|---|---|
| **Home** | Now-playing from Spotify or Music.app with live progress bar, album art, and media controls. Shows the current week's calendar and local weather. |
| **File Shelf** | Drag & drop files onto the island to hold them temporarily. Supports reference mode (keep original) or absorb mode (cut & paste). |
| **Clipboard** | Auto-captures copies. Persists between restarts. **Pin** text or images to keep them forever, or delete entries to clean up. |
| **AI** | Ask anything inline — powered by OpenRouter. Configurable models. |

**Extras:**
- Hover the island to expand, mouse away to collapse — smooth spring animation.
- Charging indicator flashes when you plug/unplug power.
- Persistent data: All settings and clipboard items are saved to `~/DynamicIsland/`.
- `Cmd + Shift + I` to toggle visibility.
- Always on top, lives above full-screen apps.

---

## Installation

```bash
git clone https://github.com/31Benzi/DynamicIsland-MacOS.git
cd dynamic-island-mac

npm install

npm start
```

### Build your own DMG
```bash
npm run dist
```
Find your installer in the `dist/` folder.

---

## Data & Persistence

Your data is stored in the `~/DynamicIsland` folder in your Home directory. It is visible in Finder so you can easily manage:
- `clipboard.json`: Your entire history and pinned items.
- `config.json`: Your AI API keys and app preferences.
- `ShelfHoldingArea/`: Files you've dragged into the shelf.

---

## AI Setup (Optional)

1. Open the **Settings** tab in the Dynamic Island (click the gear icon).
2. Enter your [OpenRouter](https://openrouter.ai/) API key.
3. (Optional) Choose a model like `google/gemini-2.0-flash-001`.
4. Click **Save Changes**.

---

## Requirements

- macOS 12 Monterey or later
- Node.js 18+
- Spotify or Apple Music installed (for media controls)

---

## License

MIT — do whatever you want, a star is appreciated ⭐
