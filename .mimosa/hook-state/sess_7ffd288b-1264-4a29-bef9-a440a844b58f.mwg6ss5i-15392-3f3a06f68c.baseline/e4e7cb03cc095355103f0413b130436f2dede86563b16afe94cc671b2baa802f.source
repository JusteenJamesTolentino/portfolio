import { ExternalLink } from 'lucide-react';
import { toolCards } from '../../utils/toolCards';

function ToolsApp({ openBrowser }) {
  return <div className='grid gap-3 md:grid-cols-2'>{toolCards.map(tool => <article key={tool.title} className='flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-4'><div><h2 className='text-sm font-bold text-amber-200'>{tool.title}</h2><p className='mt-2 text-xs leading-relaxed text-white/65'>{tool.description}</p></div>{tool.href ? <button type='button' onClick={() => openBrowser(tool.href)} className='mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-400/15 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-400/25'>Open tool <ExternalLink className='h-3.5 w-3.5' /></button> : <span className='mt-4 badge badge-outline badge-sm border-white/15 text-white/50'>Coming Soon</span>}</article>)}</div>;
}

export default ToolsApp;
