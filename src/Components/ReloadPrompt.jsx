import { useRegisterSW } from 'virtual:pwa-register/react';

function ReloadPrompt({ hidden = false }) {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error('Service worker registration failed:', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (hidden || (!offlineReady && !needRefresh)) return null;

  return (
    <div className='fixed inset-x-4 bottom-4 z-[100] sm:left-auto sm:max-w-md'>
      <div role={needRefresh ? 'alert' : 'status'} className='alert bg-base-300/80 backdrop-blur-xl border border-white/10 shadow-xl'>
        <div className='flex flex-col gap-1'>
          <span className='font-semibold'>
            {needRefresh ? 'A new version is available.' : 'JusteenDev is ready to work offline.'}
          </span>
          <span className='text-sm opacity-80'>
            {needRefresh
              ? 'Reload when you are ready. Active serial sessions will be disconnected.'
              : 'Previously visited pages can now open without a network connection.'}
          </span>
        </div>

        <div className='flex gap-2'>
          {needRefresh && (
            <button type='button' className='btn btn-primary btn-sm' onClick={() => updateServiceWorker(true)}>
              Reload
            </button>
          )}
          <button type='button' className='btn btn-ghost btn-sm' onClick={close}>
            {needRefresh ? 'Later' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReloadPrompt;
