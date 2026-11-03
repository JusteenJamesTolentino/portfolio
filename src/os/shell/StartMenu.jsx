import { useState } from 'react';
import { Power, Search } from 'lucide-react';

function StartMenu({ apps, onOpen, onSwitchView }) {
  const [search, setSearch] = useState('');
  const filtered = apps.filter(app => app.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div onPointerDown={event => event.stopPropagation()} className='absolute bottom-16 left-4 z-[80] w-80 rounded-2xl border border-white/15 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-2xl'>
      <div className='relative mb-4'>
        <Search className='absolute left-3 top-2.5 h-4 w-4 text-white/35' />
        <input
          autoFocus
          type='search'
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder='Search portfolio apps...'
          className='w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/35 focus:border-blue-400/50'
        />
      </div>
      <p className='px-2 text-[10px] font-semibold uppercase tracking-wider text-white/35'>Applications</p>
      <div className='mt-2 max-h-72 space-y-1 overflow-auto'>
        {filtered.map(app => {
          const Icon = app.icon;
          return (
            <button key={app.id} type='button' onClick={() => onOpen(app.id)} className='flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-white/10'>
              <span className={`rounded-lg p-2 ${app.bg}`}><Icon className={`h-4 w-4 ${app.color}`} /></span>
              <span className='text-xs font-medium text-white/90'>{app.title}</span>
            </button>
          );
        })}
      </div>
      <div className='mt-4 flex items-center justify-between border-t border-white/10 pt-3'>
        <div className='flex items-center gap-2'>
          <img src='/logo.png' alt='' className='h-8 w-8 rounded-lg object-cover' />
          <div><p className='text-xs font-semibold'>JusteenDev</p><p className='text-[10px] text-white/45'>Fullstack Developer</p></div>
        </div>
        <button type='button' aria-label='Switch view' title='Switch View' className='rounded-lg p-2 text-white/55 hover:bg-white/10 hover:text-white' onClick={onSwitchView}>
          <Power className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}

export default StartMenu;
