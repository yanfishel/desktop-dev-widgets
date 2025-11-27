## Desktop Dev Widgets

Desktop Dev Widgets is a cross‑platform Electron application that provides small, always‑on‑top desktop widgets tailored for developers. It includes widgets such as an analog clock, weather, notes, system information, web search, and various dev utilities (encoding/decoding, date/time helpers, color tools, and a playful rubber‑duck assistant). A tray icon lets you quickly toggle options like size and lock position, open the About window, or quit the app.

#### Stack
- Language: TypeScript
- Runtime: Electron 39 (main/renderer processes)
- Build tooling: Electron Forge 7 with Webpack
- Package manager: npm (package-lock.json present)

---

### Requirements
- Node.js 18+ (LTS recommended)
- npm 8+
- OS: Windows, macOS, or Linux
  - Packaging targets configured: Squirrel (Windows), ZIP (macOS), RPM and DEB (Linux)

Note: Electron bundles its own Chromium/Node runtime, but building native packages for a platform generally works best when run on that platform (e.g., build Windows installer on Windows).

---

### Getting started
1. Clone the repository
   ```bash
   git clone https://github.com/yfishel/desktop-dev-widgets.git
   cd desktop-dev-widgets
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Start in development
   ```bash
   npm start
   ```

On first run, the app creates a tray icon. Use the tray menu to open options, the About window, change size, lock position, or quit. In the main window, press `F12` to open DevTools (a shortcut is registered when the main window is focused).

---

### Scripts
All scripts are defined in `package.json`.

- `npm start` — Run the Electron app in development mode via Electron Forge.
- `npm run package` — Package the app for the current platform (un-signed installers/archives).
- `npm run make` — Make distributables (platform-specific installers) using configured makers.
- `npm run publish` — Publish artifacts using Electron Forge’s publish pipeline (configure targets first).
- `npm run lint` — Run ESLint over `*.ts`/`*.tsx`.

---

### Building and distribution
- Development: `npm start`
- Package (for local testing): `npm run package`
- Create installers: `npm run make`
- Publish: `npm run publish` (requires publisher configuration)

Webpack is used for both the main and renderer processes. TypeScript is compiled via `ts-loader` with `transpileOnly: true`, and CSS in the renderer is handled via `style-loader` + `css-loader`.

---

### Configuration and data
- App metadata: `package.json` (name, productName, version, author, homepage, bugs)
- App config paths: `src/config/index.ts`
  - Settings directory: `${Documents}/desktop-widgets`
  - Settings file: `${Documents}/desktop-widgets/app-settings.json`
- App icon: `public/images/icon.png`

Settings such as window position, size, and lock state are persisted and used to restore the UI on restart. The tray menu reflects and controls some of these settings.

---

### Development tips
- DevTools: Press `F12` while the main window is focused to open DevTools.
- Tray menu: Click the tray icon to open the menu. You can lock position, change size (Small/Medium/Large), open About, or Quit.
- Window behavior: The main window is frameless, transparent, non‑resizable, and skipped from the taskbar by default; sizing and locking are controlled via the tray and settings.

---

### License
This project is licensed under the MIT License. See the `license` field in `package.json`.

---

### Contributing
Issues and pull requests are welcome.

If you encounter a problem, please open an issue at:
`https://github.com/yfishel/desktop-dev-widgets/issues`
