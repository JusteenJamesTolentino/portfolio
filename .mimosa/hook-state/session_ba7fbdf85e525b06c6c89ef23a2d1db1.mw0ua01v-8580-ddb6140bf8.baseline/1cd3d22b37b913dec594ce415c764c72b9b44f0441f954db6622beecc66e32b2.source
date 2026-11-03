import { useEffect, useRef } from 'react';
import { ArrowLeft, Globe2, Monitor, Smartphone } from 'lucide-react';

function ViewChooser({ mode = 'choose', onChooseWeb, onChooseOs, onBack }) {
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
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      className='m-auto w-[min(92vw,760px)] max-h-[90dvh] overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/80 p-0 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-md'
      aria-labelledby='view-chooser-title'
      aria-describedby='view-chooser-description'
    >
      {mode === 'rejected' ? (
        <div className='p-6 sm:p-8 text-center'>
          <div className='mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10'>
            <Smartphone className='h-8 w-8 text-amber-300' />
          </div>
          <h1 id='view-chooser-title' className='text-2xl font-bold'>OS View needs a larger screen</h1>
          <p id='view-chooser-description' className='mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/65'>
            OS View is an interactive desktop experience designed for screens at least 1024 pixels wide.
            Web Page View contains the same portfolio content and works on phones and tablets.
          </p>
          <div className='mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row'>
            <button type='button' className='btn btn-ghost' onClick={onBack}>
              <ArrowLeft className='h-4 w-4' />
              Back to choices
            </button>
            <button ref={initialButtonRef} type='button' className='btn btn-primary' onClick={onChooseWeb}>
              Continue with Web Page View
            </button>
          </div>
        </div>
      ) : (
        <div className='p-5 sm:p-8'>
          <div className='text-center'>
            <span className='badge badge-outline border-white/20 text-white/70'>Choose your experience</span>
            <h1 id='view-chooser-title' className='mt-4 text-2xl font-bold sm:text-3xl'>Welcome to JusteenDev</h1>
            <p id='view-chooser-description' className='mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/60'>
              Explore the portfolio as a familiar scrolling website or launch the interactive desktop experience.
              Your choice is remembered for this browser session.
            </p>
          </div>

          <div className='mt-7 grid gap-4 md:grid-cols-2'>
            <button
              ref={initialButtonRef}
              type='button'
              onClick={onChooseWeb}
              className='group rounded-2xl border border-white/15 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/60'
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300'>
                <Globe2 className='h-6 w-6' />
              </div>
              <h2 className='mt-4 text-lg font-semibold'>Web Page View</h2>
              <p className='mt-2 text-sm leading-relaxed text-white/60'>
                The responsive scrolling portfolio, optimized for every screen size.
              </p>
              <span className='mt-5 inline-flex text-xs font-semibold uppercase tracking-wider text-cyan-300'>Open website</span>
            </button>

            <button
              type='button'
              onClick={onChooseOs}
              className='group rounded-2xl border border-white/15 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/60'
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300'>
                <Monitor className='h-6 w-6' />
              </div>
              <h2 className='mt-4 text-lg font-semibold'>OS View</h2>
              <p className='mt-2 text-sm leading-relaxed text-white/60'>
                A desktop-style portfolio with draggable windows, apps, a taskbar, and terminal.
              </p>
              <span className='mt-5 inline-flex text-xs font-semibold uppercase tracking-wider text-indigo-300'>Desktop only</span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default ViewChooser;
