import { useEffect, useRef } from 'react';
import { ArrowLeft, Bug, Gamepad2, Globe2, Monitor, Smartphone, X } from 'lucide-react';

function ViewChooser({ mode = 'choose', activeMode = 'web', onChooseWeb, onChooseHacker, onChooseOs, onChooseGame, onBack, onClose }) {
  const dialogRef = useRef(null);
  const initialButtonRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open) dialog?.showModal();
    initialButtonRef.current?.focus();
    return () => dialog?.close();
  }, [mode]);

  const handleCancel = event => {
    event.preventDefault();
    if (mode === 'rejected') onBack?.();
    else onClose?.();
  };

  const modeCardClass = (id, color) => `group rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:bg-white/10 focus:outline-none focus:ring-2 ${activeMode === id ? `${color} bg-white/10` : 'border-white/15 bg-white/5'}`;

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      className='m-auto w-[min(92vw,900px)] max-h-[90dvh] overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/80 p-0 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-md'
      aria-labelledby='modes-title'
      aria-describedby='modes-description'
    >
      {mode === 'rejected' ? (
        <div className='p-6 sm:p-8 text-center'>
          <div className='mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10'>
            <Smartphone className='h-8 w-8 text-amber-300' />
          </div>
          <h1 id='modes-title' className='text-2xl font-bold'>OS Mode needs a larger screen</h1>
          <p id='modes-description' className='mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/65'>
            OS Mode is an interactive desktop experience designed for screens at least 1024 pixels wide.
            Web Page Mode contains the same portfolio content and works on phones and tablets.
          </p>
          <div className='mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row'>
            <button type='button' className='btn btn-ghost' onClick={onBack}>
              <ArrowLeft className='h-4 w-4' />
              Back to Modes
            </button>
            <button ref={initialButtonRef} type='button' className='btn btn-primary' onClick={onChooseWeb}>
              Continue with Web Page Mode
            </button>
          </div>
        </div>
      ) : (
        <div className='relative p-5 sm:p-8'>
          <button type='button' className='btn btn-ghost btn-circle btn-sm absolute right-4 top-4' onClick={onClose} aria-label='Close Modes'>
            <X className='h-5 w-5' />
          </button>

          <div className='text-center'>
            <span className='badge badge-outline border-white/20 text-white/70'>Modes</span>
            <h1 id='modes-title' className='mt-4 text-2xl font-bold sm:text-3xl'>Choose a portfolio mode</h1>
            <p id='modes-description' className='mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/60'>
              Web Page Mode is the default. Switch modes anytime for a different interactive experience.
            </p>
          </div>

          <div className='mt-7 grid gap-4 sm:grid-cols-2'>
            <button
              ref={initialButtonRef}
              type='button'
              onClick={onChooseWeb}
              aria-pressed={activeMode === 'web'}
              className={modeCardClass('web', 'border-cyan-400/70 ring-cyan-400/60')}
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300'>
                <Globe2 className='h-6 w-6' />
              </div>
              <h2 className='mt-4 text-lg font-semibold'>Web Page Mode</h2>
              <p className='mt-2 text-sm leading-relaxed text-white/60'>The default responsive scrolling portfolio for every screen size.</p>
              <span className='mt-5 inline-flex text-xs font-semibold uppercase tracking-wider text-cyan-300'>{activeMode === 'web' ? 'Active mode' : 'Open webpage'}</span>
            </button>

            <button
              type='button'
              onClick={onChooseHacker}
              aria-pressed={activeMode === 'hacker'}
              className={modeCardClass('hacker', 'border-emerald-400/70 ring-emerald-400/60')}
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300'>
                <Bug className='h-6 w-6' />
              </div>
              <h2 className='mt-4 text-lg font-semibold'>Hacker Mode</h2>
              <p className='mt-2 text-sm leading-relaxed text-white/60'>Watch the builder swarm reconstruct and erase the live portfolio.</p>
              <span className='mt-5 inline-flex text-xs font-semibold uppercase tracking-wider text-emerald-300'>{activeMode === 'hacker' ? 'Active mode' : 'Start reconstruction'}</span>
            </button>

            <button
              type='button'
              onClick={onChooseGame}
              aria-pressed={activeMode === 'game'}
              className={modeCardClass('game', 'border-fuchsia-400/70 ring-fuchsia-400/60')}
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-400/10 text-fuchsia-300'>
                <Gamepad2 className='h-6 w-6' />
              </div>
              <h2 className='mt-4 text-lg font-semibold'>Game Mode</h2>
              <p className='mt-2 text-sm leading-relaxed text-white/60'>A cyberpunk HUD experience with quests, contracts, and skills.</p>
              <span className='mt-5 inline-flex text-xs font-semibold uppercase tracking-wider text-fuchsia-300'>{activeMode === 'game' ? 'Active mode' : 'Enter the grid'}</span>
            </button>

            <button
              type='button'
              onClick={onChooseOs}
              aria-pressed={activeMode === 'os'}
              className={modeCardClass('os', 'border-indigo-400/70 ring-indigo-400/60')}
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300'>
                <Monitor className='h-6 w-6' />
              </div>
              <h2 className='mt-4 text-lg font-semibold'>OS Mode</h2>
              <p className='mt-2 text-sm leading-relaxed text-white/60'>A desktop portfolio with draggable windows, apps, a taskbar, and terminal.</p>
              <span className='mt-5 inline-flex text-xs font-semibold uppercase tracking-wider text-indigo-300'>{activeMode === 'os' ? 'Active mode' : 'Desktop screens'}</span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default ViewChooser;
