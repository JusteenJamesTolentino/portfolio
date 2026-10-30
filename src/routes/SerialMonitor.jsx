import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const BAUD_RATES = [9600, 19200, 38400, 57600, 115200, 230400];
const LINE_ENDINGS = [
  { label: '\\n', value: '\n' },
  { label: '\\r\\n', value: '\r\n' },
  { label: 'none', value: '' },
];
const CHUNK_SIZES = [64, 128, 256, 512, 1024];
const CHUNK_DELAYS = [
  { label: 'no delay', value: 0 },
  { label: '5 ms', value: 5 },
  { label: '10 ms', value: 10 },
  { label: '25 ms', value: 25 },
  { label: '50 ms', value: 50 },
];

// Web Serial API is Chromium-only and requires HTTPS or localhost.
const isSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32Hex(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return ((c ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0');
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function SerialMonitor() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [baudRate, setBaudRate] = useState(115200);
  const [log, setLog] = useState('');
  const [input, setInput] = useState('');
  const [lineEnding, setLineEnding] = useState('\n');
  const [error, setError] = useState(null);

  const [file, setFile] = useState(null);
  const [fileCrc, setFileCrc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, total: 0 });
  const [chunkSize, setChunkSize] = useState(256);
  const [chunkDelay, setChunkDelay] = useState(10);
  const cancelUploadRef = useRef(false);

  const portRef = useRef(null);
  const readerRef = useRef(null);
  const keepReadingRef = useRef(false);
  const terminalRef = useRef(null);

  const uploadPercent = progress.total > 0 ? Math.round((progress.sent / progress.total) * 100) : 0;

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

  const onFileChange = async e => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const data = await selected.arrayBuffer();
    setFile({ name: selected.name, size: selected.size, data });
    setFileCrc(crc32Hex(new Uint8Array(data)));
    setProgress({ sent: 0, total: 0 });
  };

  const uploadBin = async () => {
    if (!portRef.current?.writable || !file) return;
    setError(null);
    setUploading(true);
    cancelUploadRef.current = false;
    setProgress({ sent: 0, total: file.size });
    setLog(prev => prev + `\n[uploading ${file.name} (${formatSize(file.size)}) @ ${chunkSize} B chunks]\n`);
    const writer = portRef.current.writable.getWriter();
    try {
      const bytes = new Uint8Array(file.data);
      for (let offset = 0; offset < bytes.length; offset += chunkSize) {
        if (cancelUploadRef.current) {
          appendLog('\n[upload cancelled]\n');
          break;
        }
        const chunk = bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length));
        await writer.write(chunk);
        setProgress({ sent: offset + chunk.length, total: bytes.length });
        if (chunkDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, chunkDelay));
        }
      }
      if (!cancelUploadRef.current) {
        appendLog(`[upload complete, CRC32 ${fileCrc}]\n`);
      }
    } catch (e) {
      setError(`Upload failed: ${e.message}`);
      appendLog('\n[upload failed]\n');
    } finally {
      writer.releaseLock();
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    cancelUploadRef.current = true;
  };

  const fileInfo = useMemo(() => (file ? `${file.name} · ${formatSize(file.size)}` : null), [file]);

  return (
    <div className='min-h-screen bg-neutral text-neutral-content'>
      <div className='w-full max-w-6xl mx-auto px-4 pt-16 pb-10 flex flex-col gap-4'>
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

        <div className='flex flex-col lg:flex-row gap-4 items-start'>
          <div className='flex flex-col gap-4 flex-1 w-full min-w-0'>
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

          <aside className='w-full lg:w-80 shrink-0 border border-white/40 rounded-lg p-4 flex flex-col gap-3'>
            <h2 className='font-bold text-lg'>Firmware Uploader</h2>

            <label className='form-control w-full'>
              <span className='label-text text-sm mb-1'>Firmware file (.bin)</span>
              <input
                type='file'
                accept='.bin,application/octet-stream'
                onChange={onFileChange}
                disabled={uploading}
                className='file-input file-input-bordered file-input-sm w-full bg-black/40'
              />
            </label>

            {file && (
              <div className='text-sm flex flex-col gap-1 bg-black/40 rounded-lg p-3 font-mono break-all'>
                <span>{fileInfo}</span>
                <span className='opacity-80'>CRC32: {fileCrc}</span>
              </div>
            )}

            {uploading && (
              <div className='flex flex-col gap-1'>
                <progress className='progress progress-primary w-full' value={uploadPercent} max={100}></progress>
                <span className='text-xs opacity-80 font-mono'>{uploadPercent}% · {formatSize(progress.sent)} / {formatSize(progress.total)}</span>
              </div>
            )}

            <div className='flex flex-col gap-2 text-sm'>
              <label className='flex items-center justify-between gap-2'>
                Chunk size
                <select
                  value={chunkSize}
                  onChange={e => setChunkSize(Number(e.target.value))}
                  disabled={uploading}
                  className='select select-bordered select-sm bg-black/40 font-mono'
                >
                  {CHUNK_SIZES.map(size => (
                    <option key={size} value={size}>{size} B</option>
                  ))}
                </select>
              </label>
              <label className='flex items-center justify-between gap-2'>
                Chunk delay
                <select
                  value={chunkDelay}
                  onChange={e => setChunkDelay(Number(e.target.value))}
                  disabled={uploading}
                  className='select select-bordered select-sm bg-black/40 font-mono'
                >
                  {CHUNK_DELAYS.map(delay => (
                    <option key={delay.value} value={delay.value}>{delay.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {uploading ? (
              <button type='button' className='btn btn-error btn-sm' onClick={cancelUpload}>Cancel Upload</button>
            ) : (
              <button type='button' className='btn btn-primary btn-sm' onClick={uploadBin} disabled={!connected || !file}>
                Upload .bin
              </button>
            )}

            <p className='text-xs opacity-70'>
              Sends the file bytes as-is over the serial port. Use with a device that expects a raw
              .bin stream (a bootloader or OTA-aware firmware). The CRC32 is shown so you can verify
              the transfer on the device side.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default SerialMonitor;
