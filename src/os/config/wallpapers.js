export const WALLPAPERS = [
  {
    id: 'aurora',
    name: 'Aurora',
    type: 'css',
    className: 'bg-gradient-to-tr from-indigo-950 via-purple-950 to-slate-950',
    desc: 'Classic static gradient',
    palette: { accent: '#818cf8', accentSoft: 'rgba(129, 140, 248, 0.45)', themeColor: '#1e1b4b' },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    type: 'css',
    className: 'bg-gradient-to-br from-slate-950 via-blue-950 to-neutral-950',
    desc: 'Deep calm blue gradient',
    palette: { accent: '#60a5fa', accentSoft: 'rgba(96, 165, 250, 0.45)', themeColor: '#0b1120' },
  },
  {
    id: 'cyber',
    name: 'Cyber',
    type: 'css',
    className: 'bg-gradient-to-r from-blue-950 via-teal-950 to-black',
    desc: 'Cool teal city tones',
    palette: { accent: '#2dd4bf', accentSoft: 'rgba(45, 212, 191, 0.45)', themeColor: '#042f2e' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    type: 'css',
    className: 'bg-gradient-to-tr from-amber-950 via-rose-950 to-slate-950',
    desc: 'Warm evening gradient',
    palette: { accent: '#fb7185', accentSoft: 'rgba(251, 113, 133, 0.45)', themeColor: '#4c0519' },
  },
  {
    id: 'matrix',
    name: 'Matrix Rain',
    type: 'canvas',
    desc: 'Digital rain code stream',
    palette: { accent: '#34d399', accentSoft: 'rgba(52, 211, 153, 0.45)', themeColor: '#020d0a' },
  },
  {
    id: 'particles',
    name: 'Particle Waves',
    type: 'canvas',
    desc: 'Interactive floating nodes',
    palette: { accent: '#38bdf8', accentSoft: 'rgba(56, 189, 248, 0.45)', themeColor: '#090d16' },
  },
  {
    id: 'starfield',
    name: 'Starfield Void',
    type: 'canvas',
    desc: 'Warp speed space stars',
    palette: { accent: '#a5b4fc', accentSoft: 'rgba(165, 180, 252, 0.45)', themeColor: '#030712' },
  },
  {
    id: 'fluid',
    name: 'Fluid Mesh',
    type: 'canvas',
    desc: 'Morphing color gradients',
    palette: { accent: '#c084fc', accentSoft: 'rgba(192, 132, 252, 0.45)', themeColor: '#0b0f19' },
  },
  {
    id: 'grid',
    name: 'Cyber Grid',
    type: 'canvas',
    desc: 'Synthwave perspective grid',
    palette: { accent: '#f472b6', accentSoft: 'rgba(244, 114, 182, 0.45)', themeColor: '#090514' },
  },
  {
    id: 'sakura',
    name: 'Sakura Drift',
    type: 'canvas',
    anime: true,
    desc: 'Anime petals in a pastel night sky',
    palette: { accent: '#f9a8d4', accentSoft: 'rgba(249, 168, 212, 0.5)', themeColor: '#2b1b3d' },
  },
  {
    id: 'street',
    name: 'Night Street',
    type: 'image',
    className: "bg-[url('/hero-night-street.jpg')] bg-cover bg-center",
    desc: 'Portfolio night photography',
    palette: { accent: '#fbbf24', accentSoft: 'rgba(251, 191, 36, 0.45)', themeColor: '#0a0a0a' },
  },
];

export function getWallpaper(id) {
  return WALLPAPERS.find(wallpaper => wallpaper.id === id) ?? WALLPAPERS[0];
}
