import { RotateCcw } from 'lucide-react';
import { WALLPAPERS } from '../config/wallpapers';

function SettingsApp({ wallpaperId, setWallpaperId, resetLayout }) {
  return <div className='space-y-5'><section><h2 className='text-xs font-semibold uppercase tracking-wider text-white/40'>Desktop wallpaper</h2><div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3'>{WALLPAPERS.map(wallpaper => <button key={wallpaper.id} type='button' onClick={() => setWallpaperId(wallpaper.id)} className={`rounded-xl border p-2 text-left transition ${wallpaperId === wallpaper.id ? 'border-blue-400 bg-blue-400/15 ring-1 ring-blue-400/30' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}><span className={`block h-16 rounded-lg ${wallpaper.className}`} /><span className='mt-2 block text-xs text-white/75'>{wallpaper.name}</span></button>)}</div></section><section className='border-t border-white/10 pt-4'><button type='button' onClick={resetLayout} className='btn btn-outline btn-sm border-white/20'><RotateCcw className='h-4 w-4' /> Reset window layout</button></section></div>;
}

export default SettingsApp;
