import { Image as ImageIcon, RotateCcw, SlidersHorizontal, Sparkles, Sun, Tv } from 'lucide-react';
import { WALLPAPERS } from '../config/wallpapers';

function wallpaperIcon(wallpaper) {
  if (wallpaper.type === 'canvas') return wallpaper.anime ? <Sparkles className='h-3.5 w-3.5 text-pink-300' /> : <Tv className='h-3.5 w-3.5 text-amber-300' />;
  if (wallpaper.type === 'image') return <ImageIcon className='h-3.5 w-3.5 text-blue-300' />;
  return <Sun className='h-3.5 w-3.5 text-blue-300' />;
}

function SettingsApp({ wallpaperId, setWallpaperId, animSpeed, setAnimSpeed, animDensity, setAnimDensity, resetLayout }) {
  return (
    <div className='mx-auto max-w-xl space-y-5 py-1'>
      <section className='space-y-3'>
        <h2 className='text-xs font-semibold uppercase tracking-wider text-white/40'>Live wallpapers</h2>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
          {WALLPAPERS.map(wallpaper => (
            <button
              key={wallpaper.id}
              type='button'
              onClick={() => setWallpaperId(wallpaper.id)}
              className={`rounded-xl border p-3 text-left transition ${wallpaperId === wallpaper.id ? 'border-[var(--os-accent)] bg-[var(--os-accent-soft)]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            >
              <span className='mb-2 flex items-center justify-between'>
                <span className='text-xs font-bold text-white'>{wallpaper.name}</span>
                {wallpaperIcon(wallpaper)}
              </span>
              <span className='block text-[10px] leading-snug text-white/55'>{wallpaper.desc}</span>
              {wallpaper.anime && <span className='mt-2 inline-block rounded-full bg-pink-400/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-pink-300'>Anime</span>}
            </button>
          ))}
        </div>
      </section>

      <section className='space-y-4 border-t border-white/10 pt-4'>
        <h2 className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/40'>
          <SlidersHorizontal className='h-3.5 w-3.5 text-blue-300' />
          Canvas animation tuning
        </h2>
        <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-4'>
          <label className='block space-y-2'>
            <span className='flex justify-between text-xs'>
              <span className='font-medium text-white/80'>Animation speed</span>
              <span className='font-mono text-[var(--os-accent)]'>{animSpeed.toFixed(1)}x</span>
            </span>
            <input
              type='range'
              min='0.2'
              max='3'
              step='0.1'
              value={animSpeed}
              onChange={event => setAnimSpeed(parseFloat(event.target.value))}
              style={{ accentColor: 'var(--os-accent)' }}
              className='h-1.5 w-full cursor-pointer rounded-lg bg-white/10'
            />
          </label>
          <label className='block space-y-2 border-t border-white/10 pt-2'>
            <span className='flex justify-between text-xs'>
              <span className='font-medium text-white/80'>Petal and star density</span>
              <span className='font-mono text-[var(--os-accent)]'>{animDensity.toFixed(1)}x</span>
            </span>
            <input
              type='range'
              min='0.5'
              max='2.5'
              step='0.1'
              value={animDensity}
              onChange={event => setAnimDensity(parseFloat(event.target.value))}
              style={{ accentColor: 'var(--os-accent)' }}
              className='h-1.5 w-full cursor-pointer rounded-lg bg-white/10'
            />
          </label>
          <p className='text-[10px] leading-snug text-white/40'>
            Tuning applies to canvas wallpapers such as Matrix Rain, Particle Waves, Starfield, Fluid Mesh, Cyber Grid, and Sakura Drift.
          </p>
        </div>
      </section>

      <section className='border-t border-white/10 pt-4'>
        <button type='button' onClick={resetLayout} className='btn btn-outline btn-sm border-white/20'>
          <RotateCcw className='h-4 w-4' /> Reset window layout
        </button>
      </section>
    </div>
  );
}

export default SettingsApp;
