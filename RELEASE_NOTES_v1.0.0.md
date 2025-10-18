# Time Tracker v1.0.0 - Initial Release

A beautiful, minimalist time tracking application for macOS built with Tauri, React, and TypeScript.

## ✨ Features

### Core Functionality
- 🎨 **Project Management** - Create and manage multiple projects with custom colors
- ⏱️ **Time Tracking** - Start/stop timers with confirmation dialogs
- 📊 **Quick Stats** - View today's and this week's total time at a glance
- 📈 **Detailed Reports** - Analyze time with visual breakdowns and charts
- 💾 **CSV Export** - Export time entries for further analysis
- 🗑️ **Project Deletion** - Delete projects with cascade (removes all time entries)

### User Experience
- ⌨️ **Keyboard Shortcuts**
  - `⌘⇧S` - Start/Stop timer
  - `⌘⇧R` - Toggle reports view
- 🎯 **System Tray Integration** - Quick access from menu bar
- 🌓 **Dark Mode Support** - Automatically adapts to system theme
- 💾 **Auto-save** - Timer state persists every 10 seconds
- 🪟 **Compact UI** - Small 480x650 window optimized for menu bar apps

### Technical
- Built with **Tauri 2.1** (Rust backend)
- **React 18** + **TypeScript** frontend
- **SQLite** database for local storage
- **Tailwind CSS** for clean, minimal styling
- All data stored locally and securely

## 📦 Installation

### Option 1: Download Pre-built Binary (Recommended)

Once binaries are built and attached to this release:
1. Download the appropriate `.dmg` file for your Mac:
   - `Time Tracker_1.0.0_aarch64.dmg` (Apple Silicon - M1/M2/M3)
   - `Time Tracker_1.0.0_x64.dmg` (Intel Macs)
2. Open the `.dmg` file
3. Drag "Time Tracker" to your Applications folder
4. Launch from Applications

### Option 2: Build from Source

#### Prerequisites
- Node.js (v16+)
- Rust (latest stable via rustup)
- macOS

#### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/marifhasan/time-tracker.git
   cd time-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the app:
   ```bash
   npm run tauri build
   ```

4. The built app will be in:
   - `src-tauri/target/release/bundle/dmg/` (DMG installer)
   - `src-tauri/target/release/bundle/macos/` (App bundle)

## 🚀 Usage

1. **Create a Project** - Click "+ New" and choose a name and color
2. **Start Tracking** - Click "Start" on any project
3. **Stop Timer** - Click "Stop" when done
4. **View Reports** - Click "Reports" button to see analytics
5. **Export Data** - Use CSV export for external analysis

## 📝 What's Included

- Clean, minimal black and white UI
- Confirmation dialogs for all timer actions
- Only one project can be active at a time
- Switch projects with automatic stop/start
- Persistent data across app restarts
- Responsive and compact design

## 🔧 Technical Details

- **Window Size**: 480x650 (optimized for menu bar)
- **Database**: SQLite with automatic migrations
- **Database Location**: `~/Library/Application Support/com.arifhas.time-tracker/`
- **State Management**: React Context API
- **Build Size**: Optimized for macOS (both Intel and Apple Silicon)

## 📖 Documentation

- [README.md](https://github.com/marifhasan/time-tracker#readme) - Full documentation
- [CONTRIBUTING.md](https://github.com/marifhasan/time-tracker/blob/main/CONTRIBUTING.md) - Build and release instructions
- [LICENSE](https://github.com/marifhasan/time-tracker/blob/main/LICENSE) - MIT License

## 🐛 Known Issues

None at this time. Please report any issues on the [GitHub Issues](https://github.com/marifhasan/time-tracker/issues) page.

## 🔜 Future Enhancements

Potential features for future versions:
- Notifications for timer milestones
- Manual time entry editing
- Idle detection
- Pomodoro timer mode
- Weekly/monthly report summaries
- Goal tracking per project

## 📄 License

MIT License - See [LICENSE](https://github.com/marifhasan/time-tracker/blob/main/LICENSE) for details.

---

**First production-ready release!** 🎉

Built with ❤️ using Tauri, React, and TypeScript.
