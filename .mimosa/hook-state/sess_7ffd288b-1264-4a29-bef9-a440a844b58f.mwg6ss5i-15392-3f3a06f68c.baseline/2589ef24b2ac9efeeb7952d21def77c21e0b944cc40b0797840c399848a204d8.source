import { useEffect, useRef, useState } from 'react';
import { portfolioProfile } from '../../data/portfolioProfile';

const help = `Available commands:
  about       open About Me
  projects    open Projects
  skills      open Skills
  services    open Services
  tools       open Tools
  contact     open Contact
  browser     open Browser
  browse URL  open an HTTP(S) address in Browser
  serial      open Serial Monitor
  messenger   open Hardware Messenger
  modes       open the portfolio Modes menu
  whoami      show current identity
  clear       clear terminal`;

function TerminalApp({ openApp, openBrowser, switchView }) {
  const [history, setHistory] = useState([{ type: 'output', text: 'Welcome to JusteenDev OS Terminal.' }, { type: 'output', text: 'Type "help" to list commands.' }]);
  const [input, setInput] = useState('');
  const terminalRef = useRef(null);

  useEffect(() => {
    const terminal = terminalRef.current;
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  }, [history]);

  const run = event => {
    if (event.key !== 'Enter') return;
    const raw = input.trim();
    const command = raw.toLowerCase();
    const next = [...history, { type: 'input', text: raw }];
    const windowCommands = ['about', 'projects', 'skills', 'services', 'tools', 'contact'];
    if (windowCommands.includes(command)) { openApp(command); next.push({ type: 'output', text: `Opening ${command}...` }); }
    else if (command === 'help') next.push({ type: 'output', text: help });
    else if (command === 'browser') { openBrowser(); next.push({ type: 'output', text: 'Opening Browser...' }); }
    else if (command.startsWith('browse ')) { openBrowser(raw.slice(7).trim()); next.push({ type: 'output', text: `Opening ${raw.slice(7).trim()}...` }); }
    else if (command === 'serial') openBrowser('/serialmonitor');
    else if (command === 'messenger') openBrowser('/serialmonitor/messenger');
    else if (command === 'modes' || command === 'home') switchView();
    else if (command === 'whoami') next.push({ type: 'output', text: `${portfolioProfile.brand} · ${portfolioProfile.role} · ${portfolioProfile.email}` });
    else if (command === 'clear') { setHistory([]); setInput(''); return; }
    else if (command) next.push({ type: 'error', text: `command not found: ${command}` });
    setHistory(next); setInput('');
  };

  return <div className='flex h-full min-h-64 flex-col rounded-xl bg-black/45 p-3 font-mono text-xs'><div ref={terminalRef} className='min-h-0 flex-1 space-y-2 overflow-auto'>{history.map((item, index) => <div key={index} className={item.type === 'error' ? 'whitespace-pre-wrap text-red-300' : item.type === 'input' ? 'text-white' : 'whitespace-pre-wrap text-slate-300'}>{item.type === 'input' && <span className='text-emerald-300'>justeen@web-os:~$ </span>}{item.text}</div>)}</div><div className='mt-2 flex items-center gap-2 border-t border-white/10 pt-2'><span className='text-emerald-300'>justeen@web-os:~$</span><input autoFocus value={input} onChange={event => setInput(event.target.value)} onKeyDown={run} className='min-w-0 flex-1 bg-transparent text-white outline-none' aria-label='Terminal command' /></div></div>;
}

export default TerminalApp;
