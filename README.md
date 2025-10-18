# Time Tracker - macOS Menu Bar App

A beautiful, minimalist time tracking application built with Tauri, React, and TypeScript. Track your project time effortlessly from your macOS menu bar.

## Features

- **Menu Bar Integration**: Quick access to timer controls from the system tray
- **Project Management**: Create and manage multiple projects with custom colors
- **Time Tracking**: Start/stop timers with a single click
- **Quick Stats**: View today's and this week's total time at a glance
- **Detailed Reports**: Analyze time spent across projects with visual breakdowns
- **Export Functionality**: Export time entries to CSV for further analysis
- **Keyboard Shortcuts**:
  - `⌘ + Shift + S`: Start/Stop timer
  - `⌘ + Shift + R`: Toggle reports view
- **Dark Mode Support**: Automatically adapts to system theme
- **Auto-save**: Timer state persists across app restarts
- **SQLite Database**: All data stored locally and securely

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Tauri 2.0 (Rust)
- **Database**: SQLite with Tauri SQL plugin
- **State Management**: React Context API
- **Date Handling**: date-fns
- **Charts**: Recharts (for reports)

## Prerequisites

Before running this application, make sure you have:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://www.rust-lang.org/) (latest stable version)
- macOS (for menu bar functionality)

## Installation

1. Clone the repository:
```bash
cd /Users/arifhas/Herd/time-tracker
```

2. Install dependencies:
```bash
npm install
```

3. The Rust dependencies will be automatically managed by Cargo.

## Development

Run the development server:

```bash
npm run tauri dev
```

This will:
- Start the Vite development server for the frontend
- Compile the Rust backend
- Launch the application in development mode with hot-reload

## Build

Create a production build:

```bash
npm run tauri build
```

The compiled application will be available in `src-tauri/target/release/`.

## Project Structure

```
time-tracker/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── TimerDisplay.tsx     # Main timer display
│   │   ├── ProjectSelector.tsx  # Project selection and management
│   │   ├── QuickStats.tsx       # Today/week statistics
│   │   └── ReportsWindow.tsx    # Reports and analytics
│   ├── contexts/                 # React contexts
│   │   └── TimerContext.tsx     # Global timer state management
│   ├── hooks/                    # Custom React hooks
│   │   └── useKeyboardShortcuts.ts
│   ├── utils/                    # Utility functions
│   │   ├── database.ts          # Database operations
│   │   ├── formatTime.ts        # Time formatting utilities
│   │   └── exportCSV.ts         # CSV export functionality
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx                   # Main application component
│   └── main.tsx                  # Application entry point
│
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   ├── lib.rs               # Main Tauri setup
│   │   ├── commands.rs          # Tauri commands (API)
│   │   ├── models.rs            # Data models
│   │   └── database.rs          # Database migrations
│   ├── Cargo.toml               # Rust dependencies
│   ├── tauri.conf.json          # Tauri configuration
│   └── capabilities/            # Permission configurations
│
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Database Schema

### Projects Table
```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3B82F6',
    archived INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Time Entries Table
```sql
CREATE TABLE time_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_seconds INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

## Usage

### Starting a Timer

1. **Create a Project**: Click "+ New" to create your first project
2. **Choose a Color**: Select a color to identify your project visually
3. **Start Tracking**: Click on a project to start tracking time
4. **Stop Tracking**: Click the "Stop Timer" button when done

### Viewing Reports

1. Click the "Reports" button in the top-right corner
2. Select a date range (Today, This Week, Last Week, or Custom)
3. View project breakdowns with percentages and time totals
4. Export to CSV for further analysis

### Keyboard Shortcuts

- **⌘ + Shift + S**: Quickly start or stop the timer
- **⌘ + Shift + R**: Toggle between timer and reports view

## Features in Detail

### Auto-Save
The application automatically saves the timer state every 10 seconds, ensuring no data is lost even if the app crashes or is closed unexpectedly.

### System Tray Integration
Access the app quickly from the menu bar. The tray icon provides quick actions:
- Show/hide the main window
- Quit the application

### Project Colors
Each project can have a custom color for easy visual identification in lists and reports.

### Time Entry Management
- View all time entries in the reports section
- Entries show start time, end time, and duration
- Filter by project or date range

### Dark Mode
The app automatically respects your system's dark mode preference, providing a comfortable experience day or night.

## Troubleshooting

### Build Errors

If you encounter build errors:

1. **Ensure Rust is installed**:
```bash
rustc --version
cargo --version
```

2. **Update Rust**:
```bash
rustup update
```

3. **Clear build cache**:
```bash
rm -rf node_modules
rm -rf src-tauri/target
npm install
```

### Database Issues

The database is created automatically on first run at:
```
~/Library/Application Support/com.arifhas.time-tracker/time_tracker.db
```

To reset the database, simply delete this file and restart the app.

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License - feel free to use this project as a template for your own time tracking needs.

## Acknowledgments

- Built with [Tauri](https://tauri.app/)
- UI styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons and assets from the Tauri starter template

---

**Note**: This application is designed for macOS. While Tauri supports cross-platform development, the menu bar integration and some UI elements are optimized for macOS.

## Future Enhancements

Potential features for future versions:
- Notifications for timer milestones
- Manual time entry editing
- Project archiving
- Idle detection
- Pomodoro timer mode
- Multi-device sync
- Time entry notes
- Weekly/monthly report summaries
- Goal tracking per project

---

Enjoy tracking your time! 🚀
