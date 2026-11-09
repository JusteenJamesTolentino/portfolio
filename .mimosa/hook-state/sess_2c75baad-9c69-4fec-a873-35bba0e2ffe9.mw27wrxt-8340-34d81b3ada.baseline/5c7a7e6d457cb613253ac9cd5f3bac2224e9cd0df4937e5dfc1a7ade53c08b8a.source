import { Check, Copy, FolderGit2, Mail } from 'lucide-react';
import { useState } from 'react';
import { portfolioProfile, technologies } from '../../data/portfolioProfile';

function AboutApp({ openApp }) {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolioProfile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${portfolioProfile.email}`;
    }
  };

  return (
    <div className='mx-auto max-w-2xl space-y-5 py-1'>
      <div className='flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-5'>
        <img src='/logo.png' alt='JusteenDev logo' className='h-20 w-20 rounded-2xl border border-white/10 object-cover shadow-xl' />
        <div className='min-w-0 flex-1'>
          <h1 className='text-xl font-bold'>{portfolioProfile.brand}</h1>
          <p className='mt-0.5 text-xs font-medium text-cyan-300'>{portfolioProfile.role}</p>
          <p className='mt-2 text-xs leading-relaxed text-white/60'>{portfolioProfile.bio}</p>
          <div className='mt-3 flex flex-wrap gap-2'>
            <button type='button' onClick={copyEmail} className='inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/15'>
              {copied ? <Check className='h-3.5 w-3.5 text-emerald-300' /> : <Copy className='h-3.5 w-3.5 text-cyan-300' />}
              {copied ? 'Email copied' : 'Copy email'}
            </button>
            <button type='button' onClick={() => openApp('projects')} className='inline-flex items-center gap-1.5 rounded-lg border border-blue-400/25 bg-blue-500/20 px-3 py-1 text-xs text-blue-200 hover:bg-blue-500/30'>
              <FolderGit2 className='h-3.5 w-3.5' /> View projects
            </button>
            <a href={`mailto:${portfolioProfile.email}`} className='inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10'><Mail className='h-3.5 w-3.5' /> Contact</a>
          </div>
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        <div className='rounded-xl border border-white/10 bg-white/5 p-4'><h2 className='text-xs font-semibold uppercase tracking-wider text-white/40'>Development focus</h2><p className='mt-2 text-xs leading-relaxed text-white/75'>Responsive frontends, APIs, databases, engineering tools, and reliable interactive systems.</p></div>
        <div className='rounded-xl border border-white/10 bg-white/5 p-4'><h2 className='text-xs font-semibold uppercase tracking-wider text-white/40'>Freelance services</h2><p className='mt-2 text-xs leading-relaxed text-white/75'>{portfolioProfile.freelance}</p></div>
      </div>
      <div><h2 className='mb-2 text-xs font-semibold uppercase tracking-wider text-white/40'>Technologies</h2><div className='flex flex-wrap gap-2'>{technologies.map(item => <span key={item} className='rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/75'>{item}</span>)}</div></div>
    </div>
  );
}

export default AboutApp;
