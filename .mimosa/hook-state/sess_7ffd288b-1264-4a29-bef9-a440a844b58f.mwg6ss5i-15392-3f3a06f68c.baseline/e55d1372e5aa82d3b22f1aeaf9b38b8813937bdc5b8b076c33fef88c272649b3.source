import { Clock3 } from 'lucide-react';
import { projectCards } from '../../utils/projectCards';

function ProjectsApp() {
  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {projectCards.map(project => (
        <article key={project.title} className='flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-purple-400/30 hover:bg-white/10'>
          <div><h2 className='text-sm font-bold'>{project.title}</h2><p className='mt-2 text-xs leading-relaxed text-white/65'>{project.description}</p></div>
          <div className='mt-5 flex items-center justify-between border-t border-white/10 pt-3'><span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${project.href ? 'text-emerald-300' : 'text-amber-300'}`}><Clock3 className='h-3 w-3' /> {project.href ? 'Live project' : 'Interactive demo planned'}</span><span className='badge badge-outline badge-sm border-white/15 text-white/55'>{project.cta}</span></div>
        </article>
      ))}
    </div>
  );
}

export default ProjectsApp;
