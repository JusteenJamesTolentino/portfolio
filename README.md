# Portfolio

A personal portfolio web app built with React and Vite. It showcases projects, services, and contact details in a clean single-page layout with smooth interactive UI components.

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS + DaisyUI
- GSAP (animation support)

## Features

- Hero section with scroll-zoom background animation and typing text effect
- About Me section with tech stack badges
- Projects section with management system cards
- Services section with animated card swap display
- Tools section showcasing upcoming engineering web tools
- Serial Monitor page (`/serialmonitor`) using the Web Serial API to read/write USB serial with microcontrollers
- Hardware Messenger page (`/serialmonitor/messenger`) with serial-driven WiFi setup and MQTT chat relay through an ESP32
- Installable Progressive Web App with an offline app shell and safe update prompts
- Optional desktop OS portfolio at `/osview` with draggable windows, taskbar, Start menu, terminal, and session-based view selection
- Contact section with clickable contact cards and a message form
- Route handling for unauthorized and not found pages

## Getting Started

### Prerequisites

- Node.js 20.19+ (or 22.12+)
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## Project Structure

```text
src/
	Components/
		ReactBits/
	routes/
		404.jsx
	styles/
	utils/
	App.jsx
	Portfolio.jsx
	main.jsx
```

## Progressive Web App

The portfolio can be installed from supported browsers and uses a service worker to cache the application shell and previously loaded portfolio images. When a new deployment is available, the site asks before reloading so active serial connections and form input are not interrupted.

Offline support applies to cached portfolio pages and static demos. Web Serial still requires a Chromium-based browser, HTTPS or localhost, and connected hardware. The Hardware Messenger also requires network access for MQTT chat.

On the first homepage visit in each browser session, visitors can choose Web Page View or OS View. OS View requires a viewport at least 1024 CSS pixels wide; smaller screens receive a message directing them to the responsive Web Page View.

OS View includes a simple Browser application. It accepts HTTP(S) addresses, keeps supported links inside the desktop, and opens the same-origin Serial Monitor and Hardware Messenger with Web Serial permission. External pages run in a restricted iframe and may refuse embedded viewing through their own security headers; the Browser always provides an Open Externally fallback. Browser history tracks addresses opened through its toolbar or OS applications, but cannot observe navigation performed inside cross-origin pages.

## Notes

- Main landing route: `/`
- Fallback route: `*` (404 page)
- Unauthorized route: `/unauthorized`
