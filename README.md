<div align="center">

# 🏝️ Dynamic Island for macOS

**Bring the iPhone's Dynamic Island experience to your Mac — live music, widgets, clipboard, AI, and more, all floating at the top of your screen.**

![macOS](https://img.shields.io/badge/macOS-000000?style=flat&logo=apple&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=flat&logo=electron&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

<br/>

<img src="https://raw.githubusercontent.com/31Benzi/Remake-Build-Archive-Images/main/DynamicIslandAPP/image.png" alt="Pill - Collapsed State" width="340"/>

*The collapsed pill — always visible, always out of the way*

</div>

---

## 📸 Screenshots

<div align="center">

### 🏠 Dashboard — Media + Calendar + Weather
<img src="https://raw.githubusercontent.com/31Benzi/Remake-Build-Archive-Images/main/DynamicIslandAPP/image2.png" alt="Dashboard expanded view" width="600"/>

### 📂 The Shelf — File Drop Zone
<img src="https://raw.githubusercontent.com/31Benzi/Remake-Build-Archive-Images/main/DynamicIslandAPP/image3.png" alt="Shelf file drop" width="600"/>

### 📋 Clipboard Manager
<img src="https://raw.githubusercontent.com/31Benzi/Remake-Build-Archive-Images/main/DynamicIslandAPP/image4.png" alt="Clipboard manager" width="600"/>

### 🤖 AI Assistant
<img src="https://raw.githubusercontent.com/31Benzi/Remake-Build-Archive-Images/main/DynamicIslandAPP/image5.png" alt="AI assistant chat" width="600"/>

</div>

---

## ✨ Features

### 🎨 Core Interface & UX
- **Adaptive Design** — Anchors to the top center of your primary display, mimicking the iPhone Dynamic Island
- **Fluid Animations** — Smooth transitions between the collapsed Pill state and expanded Dashboard using premium cubic-bezier curves
- **Interactive Hover** — Expands automatically when your cursor enters the area
- **Universal Visibility** — Always on Top, visible across all macOS Spaces and full-screen apps
- **Global Hotkey** — `Cmd + Shift + I` to instantly show or hide the island from anywhere

---

### 🎵 Media Control Center
- **Smart Player Detection** — Automatically detects playback from **Spotify** and **Apple Music**
- **Live Metadata** — Displays album artwork, track name, and artist in real time
- **Playback Controls** — Play/Pause, Next Track, and Previous Track buttons
- **Animated EQ Visualizer** — Dynamic equalizer animation appears in the pill while music plays
- **Progress Bar** — Live track position and total duration display

---

### 📅 Productivity Widgets
- **Weather Widget** — Real-time conditions via `wttr.in`, with auto-detected location and automatic °C/°F based on your region
- **Dynamic Calendar** — Current month view with a focused 4-day mini-view highlighting today
- **Battery Monitor** — Live battery percentage and charging status, with a dedicated charging overlay when plugged in

---

### 🛠️ Advanced Utility Tools

#### 📋 Clipboard Manager
- Stores a persistent history of the last **50 items** (text & images)
- **Pin** favorite snippets for instant access
- One-click restore to copy any historical item back to your clipboard

#### 📂 The Shelf (File Drop)
- Drag-and-drop zone for temporary file handling
- **Hold Reference Mode** — Keeps a quick-access link to a file for easy re-dragging
- **Absorb Mode** — Moves files into a managed `ShelfHoldingArea` for later use

#### 🤖 AI Assistant
- Built-in chat powered by **OpenRouter**
- Query models like **Gemini 2.0 Flash** directly from your desktop — no browser required
- Configure your own API key and preferred model in Settings

---

### ⚙️ System & Settings
- **Custom Configuration** — Manage AI API keys, model selection, and app behavior from a simple UI
- **Launch at Login** — Optionally start the app automatically on macOS login
- **Auto-Updates** — Built-in update checker with a blue badge notification when a new version is available
- **Tray Integration** — Background menu bar tray for quick access and quitting

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/31Benzi/dynamic-island-mac.git
cd dynamic-island-mac

# Install dependencies
npm install

# Run in development
npm start

# Build for production
npm run build
```

---

## 🔧 Configuration

On first launch, open **Settings** from the expanded island to:
- Add your **OpenRouter API key** for the AI Assistant
- Select your preferred **AI model**
- Enable or disable **Launch at Login**

---

## 📄 License

MIT © 2026
