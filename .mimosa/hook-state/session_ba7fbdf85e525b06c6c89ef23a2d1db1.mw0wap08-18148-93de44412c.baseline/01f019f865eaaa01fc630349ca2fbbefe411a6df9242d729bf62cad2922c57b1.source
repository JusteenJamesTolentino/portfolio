import { Maximize2, Minimize2, Minus, X } from 'lucide-react';

const TASKBAR_HEIGHT = 56;
const EDGE_MARGIN = 8;

function OSWindow({ app, windowState, active, onFocus, onClose, onMinimize, onMaximize, onMove, children }) {
  const Icon = app.icon;

  const startDrag = event => {
    if (windowState.maximized || event.button !== 0 || event.target.closest('button')) return;
    onFocus();
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    const start = { x: event.clientX, y: event.clientY, left: windowState.rect.x, top: windowState.rect.y };

    const move = moveEvent => {
      const maxX = Math.max(EDGE_MARGIN, window.innerWidth - windowState.rect.width - EDGE_MARGIN);
      const maxY = Math.max(EDGE_MARGIN, window.innerHeight - TASKBAR_HEIGHT - 40);
      const x = Math.min(maxX, Math.max(EDGE_MARGIN, start.left + moveEvent.clientX - start.x));
      const y = Math.min(maxY, Math.max(EDGE_MARGIN, start.top + moveEvent.clientY - start.y));
      onMove(x, y);
    };

    const finish = finishEvent => {
      if (target.hasPointerCapture(finishEvent.pointerId)) target.releasePointerCapture(finishEvent.pointerId);
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', finish);
      target.removeEventListener('pointercancel', finish);
    };

    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', finish);
    target.addEventListener('pointercancel', finish);
  };

  const style = windowState.maximized
    ? { inset: `8px 8px ${TASKBAR_HEIGHT + 8}px`, zIndex: windowState.zIndex }
    : {
        left: windowState.rect.x,
        top: windowState.rect.y,
        width: windowState.rect.width,
        height: windowState.rect.height,
        zIndex: windowState.zIndex,
      };

  const accentStyle = active
    ? { borderColor: 'var(--os-accent)', boxShadow: '0 0 0 1px var(--os-accent-soft), 0 20px 45px -25px var(--os-accent-soft)' }
    : undefined;

  return (
    <section
      style={{ ...style, ...accentStyle }}
      onPointerDown={onFocus}
      className={`absolute pointer-events-auto flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-slate-950/75 shadow-2xl backdrop-blur-2xl transition-[box-shadow,opacity,border-color] ${
        active ? '' : 'border-white/10 opacity-95'
      }`}
      aria-label={`${app.title} window`}
    >
      <header
        onPointerDown={startDrag}
        onDoubleClick={onMaximize}
        className={`flex h-11 shrink-0 cursor-move select-none items-center justify-between border-b px-4 ${active ? 'border-white/10 bg-white/10' : 'border-white/5 bg-white/5'}`}
      >
        <div className='flex items-center gap-2'>
          <Icon className={`h-4 w-4 ${app.color}`} />
          <span className='text-xs font-medium tracking-wide text-white/90'>{app.title}</span>
        </div>
        <div className='flex items-center gap-1'>
          <button type='button' aria-label={`Minimize ${app.title}`} className='rounded-lg p-1.5 text-white/55 hover:bg-white/10 hover:text-white' onClick={onMinimize}>
            <Minus className='h-3.5 w-3.5' />
          </button>
          <button type='button' aria-label={`${windowState.maximized ? 'Restore' : 'Maximize'} ${app.title}`} className='rounded-lg p-1.5 text-white/55 hover:bg-white/10 hover:text-white' onClick={onMaximize}>
            {windowState.maximized ? <Minimize2 className='h-3.5 w-3.5' /> : <Maximize2 className='h-3.5 w-3.5' />}
          </button>
          <button type='button' aria-label={`Close ${app.title}`} className='rounded-lg p-1.5 text-white/55 hover:bg-red-500/80 hover:text-white' onClick={onClose}>
            <X className='h-3.5 w-3.5' />
          </button>
        </div>
      </header>
      <div className='min-h-0 flex-1 overflow-auto p-4 text-white'>{children}</div>
    </section>
  );
}

export default OSWindow;
