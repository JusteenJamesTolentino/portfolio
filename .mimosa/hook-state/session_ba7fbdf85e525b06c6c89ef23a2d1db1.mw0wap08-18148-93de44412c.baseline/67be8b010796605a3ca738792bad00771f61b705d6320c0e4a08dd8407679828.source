import { cardSwapCards } from '../../utils/cardSwapCards';
import { serviceCards } from '../../utils/serviceCards';

function ServicesApp() {
  const services = [...serviceCards, ...cardSwapCards.filter(item => !serviceCards.some(service => service.title === item.title))];
  return <div className='grid gap-3 md:grid-cols-2'>{services.map(service => <article key={service.title} className='rounded-xl border border-white/10 bg-white/5 p-4'><h2 className='text-sm font-bold text-blue-200'>{service.title}</h2><p className='mt-2 text-xs leading-relaxed text-white/65'>{service.description}</p></article>)}</div>;
}

export default ServicesApp;
