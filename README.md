# Fixium WebApp - Frontend

This is the frontend of **Fixium**, a platform for managing electronic device repair shops. The application is developed with [SvelteKit](https://kit.svelte.dev/), uses TailwindCSS for styling, and is prepared to work both on the web and as a desktop app via Electron.

## Main Features

- User and role management (administrator, technician, receptionist)
- Reception and tracking of repair tickets
- Customer and device management
- Registration and editing of repairs with photo verification
- Tools for technicians (firmware downloads, backup, logs, recovery mode, etc.)
- Dashboard with key statistics
- Smart assistant and panic log analysis
- Modern and responsive interface
- **Route protection according to user role (authentication and authorization)**
- Real-time form validation
- Camera modal for identity verification
- Electron integration for desktop environment
- Error handling and success/failure messages in the interface

## 🚦 Requirements

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) >= 9.x
- Operating system: Linux, macOS or Windows

## 🛠️ Main Technologies

- [SvelteKit](https://kit.svelte.dev/) — Main framework
- [TailwindCSS](https://tailwindcss.com/) — Utility-first CSS
- [Electron](https://www.electronjs.org/) — Desktop environment (optional)
- [Vite](https://vitejs.dev/) — Bundler and development server

## Installation

1. Clone this repository:

   ```sh
   git clone https://github.com/fixium/frontend.git
   cd frontend
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

- [`src/`](src/) — Main source code (components, routes, styles, requests)
- [`static/`](static/) — Static files (images, icons)
- [`main.mjs`](main.mjs) — Main entry point for Electron
- [`preload.js`](preload.js) — Preload for Electron
- [`package.json`](package.json) — Scripts and dependencies configuration

## Credits

- **[Pedro](https://github.com/PedroxionX)** - Analyst
- **[David](https://github.com/Deivi171)** - Designer
- **[Frank](https://github.com/FrankSkep)** - Developer
- **[Diego](https://github.com/Dekstro999)** - Tester and frontend designer