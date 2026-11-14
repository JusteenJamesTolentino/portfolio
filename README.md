# Portfolio

A personal portfolio web app built with React and Vite. It showcases projects, services, and contact details in a clean single-page layout with smooth interactive UI components.

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS + DaisyUI
- GSAP (animation support)

## Features

- Responsive Hero containing About Me, bio, and moving technology icon rail
- Lenis inertia smooth scrolling in Web Page Mode
- Normal-mode neumorphic Web UI, scoped away from Hacker and OS modes
- Projects section with management system cards
- Services section with responsive service cards
- Tools section showcasing upcoming engineering web tools
- Serial Monitor page (`/serialmonitor`) using the Web Serial API to read/write USB serial with microcontrollers
- Hardware Messenger page (`/serialmonitor/messenger`) with serial-driven WiFi setup and MQTT chat relay through an ESP32
- Installable Progressive Web App with an offline app shell and safe update prompts
- Optional desktop OS Mode at `/osview` with draggable windows, taskbar, Start menu, and terminal
- Cyberpunk Game Mode at `/gameview` with boot sequence, quest-log projects, contracts, skill matrix, and comms panels
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

### Swarm regression tests

```bash
node --test tests/swarm-scheduler.test.js
```

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

## Hacker Mode

Web Page Mode is the default portfolio experience. Hacker Mode is available from the optional Modes modal, where visitors can also launch Game Mode or OS Mode. Normal Web Page Mode retains the fast 240 ms scroll reveals and full-exit viewport culling, with immediate reveal for keyboard focus and reduced-motion preferences.

Hacker Mode reconstructs the portfolio in a separate DOM/SVG scene. Six named builders on desktop (three on small screens) collaborate inside one active content group at a time, so headings and individual cards appear one by one. The Hero intro, embedded About content, primary technology icon set, Projects, Tools, Services, and Contact participate. As an outgoing group approaches the viewport edge, cursors erase its text, controls, images, and outlines; full exits immediately cull it and cancel obsolete work. Returning to the content triggers reconstruction again. Fast scrolling can skip the visible edge-erasure animation, but off-screen content still hides immediately. Layout space and React data stay mounted.

The HUD provides Pause/Resume, 1x/2x/3x speed, Replay, Go Live, Stop, Less motion, and optional Follow builders. Finishing the currently visible groups enters idle mode with viewport observers active and no continuous animation loop. Explicit Go Live removes construction layers and disables culling until Replay or mode exit. Escape, Stop, or choosing Web Page Mode from Modes exits Hacker Mode. The Modes modal and hidden browser tabs pause the logical clock. User wheel/touch navigation or interaction stops the optional guided tour. The hero's independent typing pauses during viewport reconstruction and resumes after Go Live.

This is an original implementation inspired by the [swarm rebuild reference](https://github.com/0xp47/0xp47.github.io/blob/main/public/scripts/swarm-rebuild.js), not a copy, real code build, or remote script load. Only explicit public target metadata and styling are measured; inputs, passwords, drafts, and validation text are not read. The live React page and contact form remain mounted across Replay, Go Live, and mode changes. Navbar controls and actual input fields remain usable, and interacting with an unfinished card completes that region. No proxy, music, third-party script, or additional network service is required. Hacker Mode is an explicit animation opt-in; Less motion suppresses cursor travel. OS Mode retains its existing wallpapers and theme.

## Progressive Web App

The portfolio can be installed from supported browsers and uses a service worker to cache the application shell and previously loaded portfolio images. When a new deployment is available, the site asks before reloading so active serial connections and form input are not interrupted.

Offline support applies to cached portfolio pages and static demos. Web Serial still requires a Chromium-based browser, HTTPS or localhost, and connected hardware. The Hardware Messenger also requires network access for MQTT chat.

Visitors open directly in Web Page Mode. The optional Modes button lets them switch to Hacker Mode, Game Mode, or OS Mode at any time. OS Mode requires a viewport at least 1024 CSS pixels wide; smaller screens receive a message directing them back to the responsive Web Page Mode. Game Mode is responsive and works on all screen sizes.

OS Mode includes a simple Browser application. It accepts HTTP(S) addresses, keeps supported links inside the desktop, and opens the same-origin Serial Monitor and Hardware Messenger with Web Serial permission. External pages run in a restricted iframe and may refuse embedded viewing through their own security headers; the Browser always provides an Open Externally fallback. Browser history tracks addresses opened through its toolbar or OS applications, but cannot observe navigation performed inside cross-origin pages.

## Notes

- Main landing route: `/`
- Fallback route: `*` (404 page)
- Unauthorized route: `/unauthorized`
