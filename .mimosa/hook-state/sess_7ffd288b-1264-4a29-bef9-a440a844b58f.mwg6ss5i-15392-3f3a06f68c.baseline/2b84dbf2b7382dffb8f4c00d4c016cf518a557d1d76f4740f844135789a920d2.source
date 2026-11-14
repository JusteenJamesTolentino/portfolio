function DesktopIcons({ apps, onOpen }) {
  return (
    <div className='absolute inset-0 bottom-14 z-0 grid auto-cols-max grid-flow-col grid-rows-6 gap-4 p-5'>
      {apps.map(app => {
        const Icon = app.icon;
        return (
          <button
            key={app.id}
            type='button'
            aria-label={`Open ${app.title}`}
            onDoubleClick={() => onOpen(app.id)}
            onKeyDown={event => { if (event.key === 'Enter') onOpen(app.id); }}
            className='group flex h-24 w-24 select-none flex-col items-center justify-center rounded-xl p-2 text-center outline-none transition hover:bg-white/10 focus:bg-white/15 focus:ring-1 focus:ring-white/30'
          >
            <span className={`rounded-2xl border border-white/10 p-3 shadow-lg backdrop-blur-md transition group-hover:scale-105 ${app.bg}`}>
              <Icon className={`h-8 w-8 ${app.color}`} />
            </span>
            <span className='mt-2 w-full truncate text-xs font-medium text-white/90 drop-shadow'>{app.title}</span>
          </button>
        );
      })}
    </div>
  );
}

export default DesktopIcons;
