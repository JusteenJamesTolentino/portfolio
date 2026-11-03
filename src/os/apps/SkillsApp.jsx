import { technologyGroups } from '../../data/portfolioProfile';

function SkillsApp() {
  return <div className='space-y-4'>{technologyGroups.map(group => <section key={group.title} className='rounded-xl border border-white/10 bg-white/5 p-4'><h2 className='border-b border-white/10 pb-2 text-xs font-bold uppercase tracking-wider text-emerald-300'>{group.title}</h2><div className='mt-3 grid grid-cols-2 gap-2'>{group.technologies.map(skill => <div key={skill} className='rounded-lg border border-white/10 bg-black/15 px-3 py-2 text-xs font-medium text-white/80'>{skill}</div>)}</div></section>)}</div>;
}

export default SkillsApp;
