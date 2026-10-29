import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const BAUD_RATES = [9600, 19200, 38400, 57600, 115200, 230400];
const LINE_ENDINGS = [
  { label: '\\n', value: '\n' },
  { label: '\\r\\n', value: '\r\n' },
  { label: 'none', value: '' },
];

// Web Serial API is Chromium-only and requires HTTPS or localhost.
const isSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

function SerialMonitor() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [baudRate, setBaudRate] = useState(115200);
  const [log, setLog] = useState('');
  const [input, setInput] = useState('');
  const [lineEnding, setLineEnding] = useState('\n');
  const [error, setError] = useState(null);

  const portRef = useRef(null);
  const readerRef = useRef(null);
  const keepReadingRef = useRef(false);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [log]);

  useEffect(() => {
    const onSerialDisconnect = e => {
      if (e.target !== portRef.current) return;
      keepReadingRef.current = false;
      portRef.current = null;
      setConnected(false);
      setLog(prev => prev + '\n[device disconnected]\n');
    };
    if (isSerialSupported) {
      navigator.serial.addEventListener('disconnect', onSerialDisconnect);
    }
    return () => {
      if (isSerialSupported) {
        navigator.serial.removeEventListener('disconnect', onSerialDisconnect);
      }
    };
  }, []);

  useEffect(() => () => {
    keepReadingRef.current = false;
    try { readerRef.current?.cancel(); } catch { /* port already gone */ }
    try { portRef.current?.close(); } catch { /* port already gone */ }
  }, []);

  const appendLog = text => setLog(prev => (prev + text).slice(-50000));

  const readLoop = async port => {
    const decoder = new TextDecoder();
    while (port.readable && keepReadingRef.current) {
      const reader = port.readable.getReader();
      readerRef.current = reader;
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) appendLog(decoder.decode(value, { stream: true }));
        }
      } catch (e) {
        if (keepReadingRef.current) setError(`Read error: ${e.message}`);
        break;
      } finally {
        reader.releaseLock();
      }
    }
  };

  const connect = async () => {
    setError(null);
    setConnecting(true);
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: Number(baudRate) });
      portRef.current = port;
      setConnected(true);
      setLog(prev => prev + `[connected @ ${baudRate} baud]\n`);
      keepReadingRef.current = true;
      readLoop(port);
    } catch (e) {
      if (e.name === 'NotFoundError') {
        setError('No port selected.');
      } else {
        setError(`Could not open port: ${e.message}`);
      }
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    keepReadingRef.current = false;
    try { await readerRef.current?.cancel(); } catch { /* reader already released */ }
    try { await portRef.current?.close(); } catch { /* port already closed */ }
    portRef.current = null;
    setConnected(false);
    setLog(prev => prev + '[disconnected]\n');
  };

  const send = async () => {
    if (!portRef.current?.writable || input === '') return;
    try {
      const writer = portRef.current.writable.getWriter();
      await writer.write(new TextEncoder().encode(input + lineEnding));
      writer.releaseLock();
      setInput('');
    } catch (e) {
      setError(`Send failed: ${e.message}`);
    }
  };

  return (
    <div className='min-h-screen bg-neutral text-neutral-content'>
      <div className='w-full max-w-4xl mx-auto px-4 pt-16 pb-10 flex flex-col gap-4'>
        <div className='flex items-center justify-between flex-wrap gap-2'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold'>Serial Monitor</h1>
            <p className='mt-1 text-sm sm:text-base opacity-80'>Read from and write to a microcontroller over USB serial, right in the browser.</p>
          </div>
          <Link to='/' className='btn btn-ghost btn-sm'>Back to Home</Link>
        </div>

        {!isSerialSupported && (
          <div role='alert' className='alert alert-warning text-sm'>
            <span>
              Your browser does not support the Web Serial API. Use Chrome, Edge, or Opera on desktop
              (the page must also be served over HTTPS or localhost).
            </span>
          </div>
        )}

        {error && (
          <div role='alert' className='alert alert-error text-sm'>
            <span>{error}</span>
            <button type='button' className='btn btn-ghost btn-xs' onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        <div className='flex flex-wrap items-center gap-2 border border-white/40 rounded-lg p-3'>
          <label className='flex items-center gap-2 text-sm'>
            Baud rate
            <select
              value={baudRate}
              onChange={e => setBaudRate(e.target.value)}
              disabled={connected}
              className='select select-bordered select-sm bg-black/40'
            >
              {BAUD_RATES.map(rate => (
                <option key={rate} value={rate}>{rate}</option>
              ))}
            </select>
          </label>

          {connected ? (
            <button type='button' className='btn btn-error btn-sm' onClick={disconnect}>Disconnect</button>
          ) : (
            <button type='button' className='btn btn-primary btn-sm' onClick={connect} disabled={!isSerialSupported || connecting}>
              {connecting ? <span className='loading loading-spinner loading-xs'></span> : null}
              {connecting ? 'Select a port...' : 'Connect'}
            </button>
          )}

          <span className={`badge badge-sm ${connected ? 'badge-success' : 'badge-ghost'}`}>
            {connected ? 'Connected' : 'Offline'}
          </span>

          <button type='button' className='btn btn-ghost btn-sm ml-auto' onClick={() => setLog('')} disabled={log === ''}>
            Clear
          </button>
        </div>

        <div
          ref={terminalRef}
          className='font-mono text-sm leading-5 whitespace-pre-wrap break-all bg-black/60 border border-white/40 rounded-lg p-4 h-[55vh] overflow-y-auto'
        >
          {log || 'No data yet. Connect a device and its serial output will appear here.'}
        </div>

        <div className='flex flex-wrap gap-2 items-center'>
          <input
            type='text'
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder='Type a message to send to the device...'
            disabled={!connected}
            className='input input-bordered flex-1 min-w-48 bg-black/40 font-mono text-sm'
          />
          <select
            value={lineEnding}
            onChange={e => setLineEnding(e.target.value)}
            className='select select-bordered select-sm bg-black/40 font-mono'
          >
            {LINE_ENDINGS.map(ending => (
              <option key={ending.label} value={ending.value}>{ending.label}</option>
            ))}
          </select>
          <button type='button' className='btn btn-primary btn-sm' onClick={send} disabled={!connected || input === ''}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default SerialMonitor;
