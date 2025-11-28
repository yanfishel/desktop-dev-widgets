Desktop Dev Widgets
===

#### Vanilla Javascript. No frameworks. Minimum dependences

Desktop Dev Widgets is a cross‑platform Electron application that provides small, always‑on‑top desktop widgets tailored for developers. It includes widgets such as an analog clock, weather, notes, system information, web search, and various dev utilities (encoding/decoding, date/time helpers, color tools, and a playful rubber‑duck assistant). A tray icon lets you quickly toggle options like size and lock position, open the About window, or quit the app.

## Screenshots
### Dark and Light mode

|  <img src="/screenshots/dark.jpg" alt="dark" width="180"/>  | <img src="/screenshots/light.jpg" alt="light" width="180"/>  |
|---|---|




Dark and light modes that follow your OS system settings or chosen in settings.

### Clock and Weather
|<img src="/screenshots/w-clock.jpg" alt="clock" width="360"/>| <img src="/screenshots/w-clock-light.jpg" alt="clock" width="360"/>|
|---|---|

**1.** Drag to change widgets position. **2.** Open Settings menu.

### Daily Weather forecast
|<img src="/screenshots/w-weather.jpg" alt="forecast" width="360"/>|<img src="/screenshots/w-weather-light.jpg" alt="forecast" width="360"/>|
|---|---|

### Search in the Web
|<img src="/screenshots/w-search.jpg" alt="search" width="360"/>|<img src="/screenshots/w-search-light.jpg" alt="search" width="360"/>|
|---|---|

Avaliable search engines: Google, Bing, Perplexity, DuckDuckGo.

### System Monitor
|<img src="/screenshots/w-system.jpg" alt="sysinfo" width="360"/>|<img src="/screenshots/w-system-light.jpg" alt="sysinfo" width="360"/>|
|---|---|

## Developer Utilities
### Encode / decode JWT
|<img src="/screenshots/w-dev-encode-jwt.jpg" alt="jwt" width="360"/>|<img src="/screenshots/w-dev-jwt-light.jpg" alt="jwt" width="360"/>|
|---|---|

### Encode / decode Base64
|<img src="/screenshots/w-dev-encode-base64.jpg" alt="base64" width="360"/>|<img src="/screenshots/w-dev-base64-light.jpg" alt="base64" width="360"/>|
|---|---|

### Date / Time manipulation
|<img src="/screenshots/w-dev-datetime.jpg" alt="date & time" width="360"/>|<img src="/screenshots/w-dev-datetime-light.jpg" alt="date & time" width="360"/>|
|---|---|

### Color tools
|<img src="/screenshots/w-dev-color.jpg" alt="color" width="360"/>|<img src="/screenshots/w-dev-color-light.jpg" alt="color" width="360"/>|
|---|---|

### Rubber duck assistant 🙂
|<img src="/screenshots/w-dev-duck.jpg" alt="rubberduck" width="360"/>|<img src="/screenshots/w-dev-duck-light.jpg" alt="rubberduck" width="360"/>|
|---|---|

### Notes
|<img src="/screenshots/w-notes.jpg" alt="notes" width="360"/>|<img src="/screenshots/w-notes-light.jpg" alt="notes" width="360"/>|
|---|---|

Simple Notes widget.

### Settings menu
|<img src="/screenshots/settings-menu.jpg" alt="settings" width="280"/>|<img src="/screenshots/settings-menu-light.jpg" alt="settings" width="280"/>|
|---|---|

### Tray menu
|<img src="/screenshots/tray.jpg" alt="tray" width="360"/>|
|---|

- **Tray menu:** You can lock position, change size (Small/Medium/Large), open About, or Quit.
- **The main window** is frameless, transparent, non‑resizable, and skipped from the taskbar by default; sizing and locking are controlled via the tray and settings.

---

### Stack
- Language: TypeScript
- Runtime: [Electron](https://www.electronjs.org/)
- Build tooling: [Electron Forge](https://www.electronforge.io/)

### Libruaries:
- [Systeminformation](https://github.com/sebhildebrandt/systeminformation)
- [Date-fns](https://date-fns.org/)
- [Jose](https://github.com/panva/jose)
- [Highlight.js](https://highlightjs.org/)
- [Sortable.js](https://github.com/SortableJS/Sortable)

---

## Requirements
- Node.js 18+ (LTS recommended)
- npm 8+
- OS: Windows, macOS, or Linux
  - Packaging targets configured: Squirrel (Windows), ZIP (macOS), RPM and DEB (Linux)

Note: Electron bundles its own Chromium/Node runtime, but building native packages for a platform generally works best when run on that platform (e.g., build Windows installer on Windows).

---

## Getting started
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

## Scripts
All scripts are defined in `package.json`.

- `npm start` — Run the Electron app in development mode via Electron Forge.
- `npm run package` — Package the app for the current platform (un-signed installers/archives).
- `npm run make` — Make distributables (platform-specific installers) using configured makers.
- `npm run publish` — Publish artifacts using Electron Forge’s publish pipeline (configure targets first).
- `npm run lint` — Run ESLint over `*.ts`/`*.tsx`.

---

## Building and distribution
- Development: `npm start`
- Package (for local testing): `npm run package`
- Create installers: `npm run make`
- Publish: `npm run publish` (requires publisher configuration)

Webpack is used for both the main and renderer processes. TypeScript is compiled via `ts-loader` with `transpileOnly: true`, and CSS in the renderer is handled via `style-loader` + `css-loader`.

---

## Configuration and data
- App metadata: `package.json` (name, productName, version, author, homepage, bugs)
- App config paths: `src/config/index.ts`
  - Settings directory: `${Documents}/desktop-widgets`
  - Settings file: `${Documents}/desktop-widgets/app-settings.json`
- App icon: `public/images/icon.png`

Settings such as window position, size, and lock state are persisted and used to restore the UI on restart. The tray menu reflects and controls some of these settings.

---

## Development tips
- DevTools: Press `F12` while the main window is focused to open DevTools.


---

## License
[MIT License.](/LICENSE.txt)

---


If you encounter a problem, please open an issue at:
`https://github.com/yfishel/desktop-dev-widgets/issues`
