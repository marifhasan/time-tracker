# Contributing to Time Tracker

Thank you for your interest in contributing to Time Tracker! This document provides guidelines and instructions for building, testing, and releasing the application.

## Development Setup

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Rust** (latest stable) - [Install via rustup](https://rustup.rs/)
- **macOS** (for full menu bar functionality)

### Installation

1. Fork and clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/time-tracker.git
cd time-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run tauri dev
```

## Project Structure

```
time-tracker/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript types
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── lib.rs          # Main entry
│   │   ├── commands.rs     # Tauri commands
│   │   ├── database.rs     # DB setup
│   │   └── models.rs       # Data models
│   └── Cargo.toml          # Rust dependencies
└── package.json            # Node dependencies
```

## Building for Production

### Local Build

To create a production build:

```bash
npm run tauri build
```

This will:
1. Compile TypeScript and build React app
2. Compile Rust backend
3. Create bundled `.app` and `.dmg` files

### Build Output

After successful build, you'll find:

**macOS Builds:**
- `src-tauri/target/release/bundle/dmg/Time Tracker_1.0.0_aarch64.dmg` (Apple Silicon)
- `src-tauri/target/release/bundle/dmg/Time Tracker_1.0.0_x64.dmg` (Intel)
- `src-tauri/target/release/bundle/macos/Time Tracker.app`

**Binary:**
- `src-tauri/target/release/time-tracker`

## Testing the Build

Before releasing, test the build:

1. Install the `.dmg` file:
```bash
open src-tauri/target/release/bundle/dmg/Time\ Tracker_*.dmg
```

2. Drag to Applications and launch
3. Test all features:
   - Create/delete projects
   - Start/stop timers
   - View reports
   - Export CSV
   - Keyboard shortcuts
   - System tray integration

## Release Process

### Version Bumping

Update version in these files:
1. `package.json` - line 4
2. `src-tauri/tauri.conf.json` - line 4
3. `src-tauri/Cargo.toml` - line 3

### Creating a Release

1. Commit version changes:
```bash
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main --tags
```

2. Build production binaries:
```bash
npm run tauri build
```

3. Create GitHub release:
```bash
gh release create v1.0.0 \
  --title "Time Tracker v1.0.0" \
  --notes "Release notes here" \
  src-tauri/target/release/bundle/dmg/*.dmg
```

Or manually via GitHub:
- Go to https://github.com/marifhasan/time-tracker/releases/new
- Choose tag: `v1.0.0`
- Title: `Time Tracker v1.0.0`
- Attach `.dmg` files from `src-tauri/target/release/bundle/dmg/`
- Publish release

## Code Style

### TypeScript/React
- Use functional components with hooks
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling

### Rust
- Follow Rust style guidelines
- Use `cargo fmt` before committing
- Run `cargo clippy` to catch common mistakes

## Database Migrations

Database schema is defined in `src-tauri/src/database.rs`.

To modify schema:
1. Update SQL in `run_migrations()`
2. Increment version if needed
3. Test migration with fresh database

## Common Issues

### Build Fails

**Clean build cache:**
```bash
rm -rf node_modules src-tauri/target
npm install
npm run tauri build
```

**Update Rust:**
```bash
rustup update stable
```

### Dev Server Issues

**Port 1420 in use:**
```bash
lsof -ti:1420 | xargs kill -9
```

**Kill all dev processes:**
```bash
pkill -9 -f "tauri dev"
pkill -9 -f "vite"
```

## Pull Request Guidelines

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes with clear commit messages
3. Test thoroughly
4. Push and create PR
5. Describe changes in PR description

## Architecture Notes

### Timer State Management
- Timer state is managed via `TimerContext`
- Auto-saves every 10 seconds
- Persists across app restarts

### Database
- SQLite via Tauri SQL plugin
- Located at: `~/Library/Application Support/com.arifhas.time-tracker/`
- Cascade deletes for related records

### System Tray
- Configured in `src-tauri/src/lib.rs`
- Menu items defined for quick access

## Questions?

Open an issue on GitHub for:
- Bug reports
- Feature requests
- Build problems
- Documentation improvements

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
