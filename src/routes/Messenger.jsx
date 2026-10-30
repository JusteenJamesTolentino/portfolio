import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Web Serial API is Chromium-only and requires HTTPS or localhost.
const isSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

const MAX_CHAT_ENTRIES = 200;
const MAX_CHAT_LENGTH = 50000;

// Line protocol sent by the ESP32 firmware:
//   ID:<deviceId>            hardware identity (from chip MAC)
//   PROMPT:<question>        device asks for input (WiFi SSID, password)
//   STATUS:<text>            device status updates (WiFi connecting, IP, failures)
//   MSG:<sender>:<text>      chat message relayed over MQTT
// Anything without a known prefix is shown as a raw device line.
function parseStatusWifiIp(text) {
  const match = text.match(/IP Address:\s*(.+)/);
  return match ? match[1].trim() : null;
}

function Messenger() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [wifiState, setWifiState] = useState('unknown');
  const [wifiIp, setWifiIp] = useState(null);
  const [chat, setChat] = useState([]);
  const [ssid, setSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [sendingCredentials, setSendingCredentials] = useState(false);
  const [msgInput, setMsgInput] = useState('');
  const [error, setError] = useState(null);

  const portRef = useRef(null);
  const readerRef = useRef(null);
  const writerRef = useRef(null);
  const keepReadingRef = useRef(false);
  const deviceIdRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    deviceIdRef.current = deviceId;
  }, [deviceId]);

  useEffect(() => {
    const onSerialDisconnect = e => {
      if (e.target !== portRef.current) return;
      cleanupPort();
      setConnected(false);
      pushChat('system', 'Device disconnected.');
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
    cleanupPort();
  }, []);

  function cleanupPort() {
    keepReadingRef.current = false;
    try { readerRef.current?.cancel(); } catch { /* reader already released */ }
    try { writerRef.current?.releaseLock(); } catch { /* writer already released */ }
    try { portRef.current?.close(); } catch { /* port already closed */ }
    portRef.current = null;
    writerRef.current = null;
  }

  function pushChat(kind, text, sender = null) {
    setChat(prev => {
      const own = kind === 'msg' && sender !== null && sender === deviceIdRef.current;
      const last = prev[prev.length - 1];
      // Devices that retry (e.g. re-asking for WiFi credentials) would flood the
      // chat, so consecutive identical lines collapse into one entry with a count.
      if (last && last.kind === kind && last.text === text && last.sender === sender) {
        const collapsed = prev.slice(0, -1);
        collapsed.push({ ...last, repeat: (last.repeat ?? 1) + 1 });
        return collapsed;
      }
      const next = [...prev, { kind, text, sender, own }];
      return next.slice(-MAX_CHAT_ENTRIES);
    });
  }

  function handleLine(raw) {
    const line = raw.trim();
    if (!line) return;

    if (line.startsWith('ID:')) {
      const id = line.slice(3).trim();
      setDeviceId(id);
      pushChat('system', `Hardware identity: ${id}`);
      return;
    }

    if (line.startsWith('PROMPT:')) {
      setWifiState('provisioning');
      pushChat('system', `Device asks: ${line.slice(7).trim()}`);
      return;
    }

    if (line.startsWith('STATUS:')) {
      const status = line.slice(7).trim();
      pushChat('system', status);
      if (status.startsWith('Connecting to Wi-Fi')) setWifiState('connecting');
      if (status.includes('WiFi connected successfully')) setWifiState('connected');
      if (status.startsWith('Wi-Fi connection failed')) setWifiState('failed');
      const ip = parseStatusWifiIp(status);
      if (ip) setWifiIp(ip);
      return;
    }

    if (line.startsWith('MSG:')) {
      const payload = line.slice(4);
      const separator = payload.indexOf(':');
      const sender = separator > -1 ? payload.slice(0, separator) : null;
      const text = separator > -1 ? payload.slice(separator + 1) : payload;
      pushChat('msg', text, sender);
      return;
    }

    pushChat('device', line);
  }

  const readLoop = async port => {
    const decoder = new TextDecoder();
    let buffer = '';
    while (port.readable && keepReadingRef.current) {
      const reader = port.readable.getReader();
      readerRef.current = reader;
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          if (!value) continue;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();
          for (const line of lines) {
            handleLine(line);
          }
        }
      } catch (e) {
        if (keepReadingRef.current) setError(`Read error: ${e.message}`);
        break;
      } finally {
        reader.releaseLock();
      }
    }
  };

  const writeLine = async text => {
    const writer = writerRef.current;
    if (!writer) throw new Error('Serial port is not open.');
    await writer.write(new TextEncoder().encode(text + '\n'));
  };

  const connect = async () => {
    setError(null);
    setConnecting(true);
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });
      writerRef.current = port.writable.getWriter();
      portRef.current = port;
      setConnected(true);
      keepReadingRef.current = true;
      pushChat('system', 'Serial connection open at 115200 baud.');
      pushChat('system', 'If the device already booted before you connected, press its reset (EN) button so it replays its setup prompts.');
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

  const disconnect = () => {
    cleanupPort();
    setConnected(false);
    pushChat('system', 'Serial connection closed.');
  };

  const sendCredentials = async () => {
    if (!connected || ssid.trim() === '' || wifiPassword === '') return;
    setError(null);
    setSendingCredentials(true);
    try {
      await writeLine(ssid.trim());
      await new Promise(resolve => setTimeout(resolve, 300));
      await writeLine(wifiPassword);
      pushChat('system', 'WiFi credentials sent to the device.');
      setWifiState('connecting');
      setWifiPassword('');
    } catch (e) {
      setError(`Could not send credentials: ${e.message}`);
    } finally {
      setSendingCredentials(false);
    }
  };

  const sendMessage = async () => {
    if (!connected || wifiState !== 'connected' || msgInput.trim() === '') return;
    try {
      await writeLine(msgInput.trim());
      setMsgInput('');
    } catch (e) {
      setError(`Could not send message: ${e.message}`);
    }
  };

  const wifiBadge = {
    unknown: <span className='badge badge-ghost badge-sm'>WiFi status unknown</span>,
    provisioning: <span className='badge badge-warning badge-sm'>WiFi not configured</span>,
    connecting: (
      <span className='badge badge-info badge-sm'>
        <span className='loading loading-spinner loading-xs'></span>
        Connecting...
      </span>
    ),
    connected: <span className='badge badge-success badge-sm'>WiFi connected{wifiIp ? ` · ${wifiIp}` : ''}</span>,
    failed: <span className='badge badge-error badge-sm'>WiFi failed</span>,
  }[wifiState];

  return (
    <div className='min-h-screen bg-neutral text-neutral-content'>
      <div className='w-full max-w-3xl mx-auto px-4 pt-16 pb-10 flex flex-col gap-4'>
        <div className='flex items-center justify-between flex-wrap gap-2'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold'>Hardware Messenger</h1>
            <p className='mt-1 text-sm sm:text-base opacity-80'>Chat over MQTT through an ESP32 connected by USB serial.</p>
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
          {connected ? (
            <button type='button' className='btn btn-error btn-sm' onClick={disconnect}>Disconnect</button>
          ) : (
            <button type='button' className='btn btn-primary btn-sm' onClick={connect} disabled={!isSerialSupported || connecting}>
              {connecting ? <span className='loading loading-spinner loading-xs'></span> : null}
              {connecting ? 'Select a port...' : 'Plug In ESP32'}
            </button>
          )}
          <span className={`badge badge-sm ${connected ? 'badge-success' : 'badge-ghost'}`}>
            {connected ? 'Serial connected' : 'Offline'}
          </span>
          <span className='font-mono text-sm' style={{ color: '#ff0055' }}>
            {deviceId ?? 'ID: not received'}
          </span>
        </div>

        <div className='border border-white/40 rounded-lg p-3 flex flex-col gap-3'>
          <div className='flex items-center justify-between gap-2 flex-wrap'>
            <h2 className='font-bold'>WiFi Setup</h2>
            {wifiBadge}
          </div>

          {wifiState === 'failed' && (
            <p className='text-sm text-error'>
              The device could not join the network. Press the reset (EN) button on the board, then
              send the credentials again.
            </p>
          )}

          {wifiState !== 'connected' ? (
            <div className='flex flex-col sm:flex-row gap-2'>
              <input
                type='text'
                value={ssid}
                onChange={e => setSsid(e.target.value)}
                placeholder='WiFi SSID'
                disabled={!connected || sendingCredentials}
                className='input input-bordered flex-1 bg-black/40 text-sm'
              />
              <input
                type='password'
                value={wifiPassword}
                onChange={e => setWifiPassword(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendCredentials(); }}
                placeholder='WiFi password'
                disabled={!connected || sendingCredentials}
                className='input input-bordered flex-1 bg-black/40 text-sm'
              />
              <button
                type='button'
                className='btn btn-primary btn-sm'
                onClick={sendCredentials}
                disabled={!connected || sendingCredentials || ssid.trim() === '' || wifiPassword === ''}
              >
                {sendingCredentials ? <span className='loading loading-spinner loading-xs'></span> : null}
                Send Credentials
              </button>
            </div>
          ) : (
            <p className='text-sm opacity-80'>
              The module is online and relaying messages on the shared MQTT room.
            </p>
          )}
        </div>

        <div
          ref={chatBoxRef}
          className='bg-black/60 border border-white/40 rounded-lg p-4 h-[45vh] overflow-y-auto flex flex-col gap-2 text-sm'
        >
          {chat.length === 0 && (
            <span className='opacity-70 font-mono'>
              Connect the ESP32, complete WiFi setup, and the conversation will appear here.
            </span>
          )}
          {chat.map((entry, index) => {
            const repeatTag = entry.repeat > 1 ? (
              <span className='badge badge-ghost badge-xs ml-2 align-middle'>x{entry.repeat}</span>
            ) : null;
            if (entry.kind === 'system') {
              return <div key={index} className='opacity-70 italic'>{entry.text}{repeatTag}</div>;
            }
            if (entry.kind === 'device') {
              return <div key={index} className='opacity-60 font-mono break-all'>device: {entry.text}{repeatTag}</div>;
            }
            if (entry.own) {
              return (
                <div key={index} className='self-end max-w-[80%] bg-primary text-primary-content rounded-lg px-3 py-1.5 break-words'>
                  {entry.text}{repeatTag}
                </div>
              );
            }
            return (
              <div key={index} className='self-start max-w-[80%] bg-base-300 text-base-content rounded-lg px-3 py-1.5 break-words'>
                {entry.sender && <div className='text-xs font-bold mb-0.5' style={{ color: '#ff0055' }}>{entry.sender}</div>}
                {entry.text}{repeatTag}
              </div>
            );
          })}
        </div>

        <div className='flex flex-wrap gap-2 items-center'>
          <input
            type='text'
            value={msgInput}
            onChange={e => setMsgInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            placeholder={wifiState === 'connected' ? 'Type a message...' : 'Connect the device to WiFi to chat'}
            disabled={!connected || wifiState !== 'connected'}
            className='input input-bordered flex-1 bg-black/40 text-sm'
          />
          <button
            type='button'
            className='btn btn-primary btn-sm'
            onClick={sendMessage}
            disabled={!connected || wifiState !== 'connected' || msgInput.trim() === ''}
          >
            Send via Hardware
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messenger;
