import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Globe2, Home, LockKeyhole, RefreshCw, Search } from 'lucide-react';
import { parseBrowserUrl } from '../utils/browserUrl';

function BrowserApp({ navigationRequest }) {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const current = history[historyIndex] ?? null;

  const navigateTo = input => {
    const parsed = parseBrowserUrl(input);
    if (!parsed.ok) {
      setError(parsed.error);
      return false;
    }
    setHistory(previous => [...previous.slice(0, historyIndex + 1), parsed]);
    setHistoryIndex(index => index + 1);
    setDraft(parsed.displayUrl);
    setError(null);
    return true;
  };

  useEffect(() => {
    if (!navigationRequest?.url) return;
    navigateTo(navigationRequest.url);
    // navigationRequest.id identifies a deliberate external launch request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationRequest?.id]);

  const frameProps = useMemo(() => {
    if (!current) return {};
    if (current.kind === 'internal') {
      return { allow: 'serial', referrerPolicy: 'same-origin' };
    }
    return {
      sandbox: 'allow-scripts allow-forms',
      referrerPolicy: 'no-referrer',
    };
  }, [current]);

  const submit = event => {
    event.preventDefault();
    const submittedAddress = new FormData(event.currentTarget).get('address');
    navigateTo(typeof submittedAddress === 'string' ? submittedAddress : draft);
  };

  const goBack = () => {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    setDraft(history[nextIndex].displayUrl);
    setError(null);
  };

  const goForward = () => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    setDraft(history[nextIndex].displayUrl);
    setError(null);
  };

  const goHome = () => {
    setHistory([]);
    setHistoryIndex(-1);
    setDraft('');
    setError(null);
  };

  return (
    <div className='flex h-full min-h-[360px] flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-950/70'>
      <div className='flex shrink-0 items-center gap-2 border-b border-white/10 bg-white/5 p-2'>
        <button type='button' aria-label='Browser back' onClick={goBack} disabled={historyIndex <= 0} className='rounded-lg p-2 text-white/70 hover:bg-white/10 disabled:opacity-25'><ArrowLeft className='h-4 w-4' /></button>
        <button type='button' aria-label='Browser forward' onClick={goForward} disabled={historyIndex >= history.length - 1} className='rounded-lg p-2 text-white/70 hover:bg-white/10 disabled:opacity-25'><ArrowRight className='h-4 w-4' /></button>
        <button type='button' aria-label='Reload page' onClick={() => setReloadKey(key => key + 1)} disabled={!current} className='rounded-lg p-2 text-white/70 hover:bg-white/10 disabled:opacity-25'><RefreshCw className='h-4 w-4' /></button>
        <button type='button' aria-label='Browser home' onClick={goHome} className='rounded-lg p-2 text-white/70 hover:bg-white/10'><Home className='h-4 w-4' /></button>
        <form onSubmit={submit} className='relative min-w-0 flex-1'>
          {current?.kind === 'external' ? <LockKeyhole className='absolute left-3 top-2.5 h-3.5 w-3.5 text-emerald-300' /> : <Globe2 className='absolute left-3 top-2.5 h-3.5 w-3.5 text-sky-300' />}
          <input name='address' aria-label='Browser address' value={draft} onChange={event => setDraft(event.target.value)} placeholder='Enter an HTTPS address' className='w-full rounded-xl border border-white/10 bg-black/25 py-2 pl-9 pr-9 text-xs text-white outline-none placeholder:text-white/30 focus:border-sky-400/50' />
          <button type='submit' aria-label='Open address' className='absolute right-2 top-1.5 rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white'><Search className='h-3.5 w-3.5' /></button>
        </form>
        {current && <a href={current.url} target='_blank' rel='noopener noreferrer' aria-label='Open current page externally' className='rounded-lg p-2 text-white/70 hover:bg-white/10'><ExternalLink className='h-4 w-4' /></a>}
      </div>

      {error && <div role='alert' className='shrink-0 border-b border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-200'>{error}</div>}
      {current?.kind === 'external' && <div className='shrink-0 border-b border-amber-400/15 bg-amber-400/5 px-3 py-1.5 text-[10px] text-amber-100/70'>Some sites block embedded viewing. Use the external button if this page stays blank or shows a refusal message.</div>}

      <div className='relative min-h-0 flex-1 bg-slate-900'>
        {current ? (
          <iframe
            key={`${current.url}-${reloadKey}`}
            title={`Browser: ${current.hostname}`}
            src={current.url}
            className='h-full w-full border-0 bg-white'
            {...frameProps}
          />
        ) : (
          <div className='grid h-full place-items-center p-8 text-center'>
            <div><span className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10'><Globe2 className='h-8 w-8 text-sky-300' /></span><h2 className='mt-4 text-lg font-semibold'>JusteenDev Browser</h2><p className='mx-auto mt-2 max-w-sm text-xs leading-relaxed text-white/50'>Open portfolio tools or enter an HTTPS address. External websites may limit what can run inside an embedded browser.</p></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowserApp;
