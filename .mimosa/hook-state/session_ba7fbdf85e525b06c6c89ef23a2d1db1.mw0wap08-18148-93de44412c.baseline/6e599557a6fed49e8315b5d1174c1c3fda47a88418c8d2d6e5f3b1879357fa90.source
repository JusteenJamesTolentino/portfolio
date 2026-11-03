import { useEffect, useState } from 'react';
import { Monitor, Sparkles, Tv, Volume2, Wifi } from 'lucide-react';

function Taskbar({ apps, windows, activeId, startMenuOpen, wallpaperName, onToggleStart, onAppClick, onCycleWallpaper }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div onPointerDown={event => event.stopPropagation()} className='absolute inset-x-0 bottom-0 z-[70] flex h-14 select-none items-center justify-between border-t border-white/10 bg-slate-950/70 px-4 backdrop-blur-2xl'>
      <div className='flex items-center gap-2'>
        <button
          type='button'
          aria-label='Open start menu'
          onClick={onToggleStart}
          className='rounded-lg p-2 transition'
          style={startMenuOpen ? { backgroundColor: 'var(--os-accent)', boxShadow: '0 4px 14px var(--os-accent-soft)' } : undefined}
        >
          <Sparkles className='h-5 w-5 text-blue-300' />
        </button>
        <span className='mx-1 h-5 w-px bg-white/15' />
        {apps.map(app => {
          const Icon = app.icon;
          const window = windows[app.id];
          const active = activeId === app.id && window.open && !window.minimized;
          return (
            <button key={app.id} type='button' aria-label={`Taskbar ${app.title}`} title={app.title} onClick={() => onAppClick(app.id)} className={`relative rounded-lg p-2 transition ${active ? 'bg-white/15' : window.open ? 'bg-white/5 hover:bg-white/10' : 'opacity-65 hover:bg-white/10 hover:opacity-100'}`}>
              <Icon className={`h-5 w-5 ${app.color}`} />
              {window.open && (
                <span
                  className='absolute bottom-0.5 left-1/2 h-1 -translate-x-1/2 rounded-full transition-all'
                  style={{ width: active ? '1rem' : '0.375rem', backgroundColor: active ? 'var(--os-accent)' : 'rgba(255,255,255,0.4)' }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className='flex items-center gap-3 text-xs text-white/75'>
        <button
          type='button'
          onClick={onCycleWallpaper}
          title='Cycle live wallpaper'
          className='flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 transition hover:bg-white/15'
        >
          <Tv className='h-3.5 w-3.5 text-[var(--os-accent)]' />
          <span className='hidden sm:inline'>{wallpaperName}</span>
        </button>
        <div className='flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1.5'>
          <Wifi className='h-3.5 w-3.5 text-emerald-400' />
          <Volume2 className='h-3.5 w-3.5' />
          <Monitor className='h-3.5 w-3.5' />
        </div>
        <div className='text-right leading-tight'>
          <p>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className='text-[10px] text-white/45'>{now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
}

export default Taskbar;
