# Fixium WebApp - Frontend

This is the frontend for **Fixium**, a platform for managing electronic device repair shops. The application is built with [SvelteKit](https://kit.svelte.dev/), styled with TailwindCSS, and can run both as a web app and as a desktop app via Electron.

## Main Features

- User and role management (administrator, technician, receptionist)
- Reception and tracking of repair tickets
- Customer and device management
- Registration and editing of repairs with photo verification
- Technician tools (firmware downloads, backup, logs, recovery mode, etc.)
- Dashboard with key statistics
- Smart assistant and panic log analysis
- Modern and responsive interface
- **Route protection according to user role (authentication and authorization)**
- Real-time form validation
- Camera modal for identity verification
- Electron integration for desktop environment
- Error and success message handling in the interface

## 🚦 Requirements

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) >= 9.x
- Operating system: Linux, macOS, or Windows

## 🛠️ Main Technologies & Dependencies

- [SvelteKit](https://kit.svelte.dev/) — Main framework
- [TailwindCSS](https://tailwindcss.com/) — Utility-first CSS
- [Electron](https://www.electronjs.org/) — Desktop environment (optional)
- [Vite](https://vitejs.dev/) — Bundler and development server
- [Chart.js](https://www.chartjs.org/) — Charts and statistics
- [GSAP](https://greensock.com/gsap/) — Animations
- [Marked](https://marked.js.org/) — Markdown parsing
- [wait-on](https://www.npmjs.com/package/wait-on) — Wait for resources (Electron integration)
- [tree-kill](https://www.npmjs.com/package/tree-kill) — Process management (Electron integration)
- [Prettier](https://prettier.io/) & [prettier-plugin-svelte](https://github.com/sveltejs/prettier-plugin-svelte) — Code formatting

> **Note:** See [`package.json`](package.json) for the full list of dependencies and versions.

## Installation

1. Clone this repository:

   ```sh
   git clone https://github.com/fixium/fixium-frontend.git
   cd fixium-frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development environment:

   ```sh
   npm run dev
   ```

4. (Optional) To run in desktop mode with Electron:

   ```sh
   npm run electron
   ```

## Project Structure

- [`src/`](src/) — Main source code (components, routes, styles, API requests)
- [`static/`](static/) — Static files (images, icons)
- [`main.mjs`](main.mjs) — Main entry point for Electron
- [`preload.js`](preload.js) — Electron preload script
- [`package.json`](package.json) — Scripts and dependencies configuration

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build the project for production
- `npm run preview` — Preview the production build
- `npm run electron` — Start the Electron desktop app
- `npm run format` — Format code with Prettier
- `npm run lint` — Check code formatting

## Credits

- **[Pedro](https://github.com/PedroxionX)** - Analyst
- **[David](https://github.com/Deivi171)** - Designer
- **[Frank](https://github.com/FrankSkep)** - Developer
- **[Diego](https://github.com/Dekstro999)** - Tester and ux/ui developer.
