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

## Notes

- Main landing route: `/`
- Fallback route: `*` (404 page)
- Unauthorized route: `/unauthorized`
