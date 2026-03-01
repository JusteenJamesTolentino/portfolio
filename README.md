# Portfolio

A personal portfolio web app built with React and Vite. It showcases projects, services, and contact details in a clean single-page layout with smooth interactive UI components.

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS + DaisyUI
- GSAP / Motion (animation support)

## Features

- Hero section with typing text effect
- Projects section with management system cards
- Services section with animated card swap display
- Contact section with clickable contact cards
- Route handling for unauthorized and not found pages

## Getting Started

### Prerequisites

- Node.js 18+
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
		Project/
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
