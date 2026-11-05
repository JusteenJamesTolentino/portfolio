import { useEffect, useState } from 'react';
import { MonitorCog } from 'lucide-react';
import { Link } from 'react-router-dom';
import TextType from './Components/ReactBits/TypingText';
import ContactForm from './Components/ContactForm';
import HackerModeToggle from './Components/HackerModeToggle';
import SwarmRebuild, { RebuildCard } from './Components/SwarmRebuild';
import { FaCode, FaRedo, FaSpider } from 'react-icons/fa';
import { projectCards } from './utils/projectCards';
import { serviceCards } from './utils/serviceCards';
import { cardSwapCards } from './utils/cardSwapCards';
import { contactCards } from './utils/contactCards';
import { toolCards } from './utils/toolCards';
import { portfolioProfile, technologies } from './data/portfolioProfile';

function Portfolio({ onSwitchView, viewChooserOpen = false }) {
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);
  const [hackerMode, setHackerMode] = useState(false);
  const [replay, setReplay] = useState(0);

  const changeHackerMode = enabled => {
    setHackerMode(enabled);
    setMobileMenuOpen(false);
    setNavHidden(false);
    if (!enabled) return;
    const cards = [...document.querySelectorAll('.swarm-workspace [data-rebuild-card]')];
    const cardInView = cards.some(card => {
      const rect = card.getBoundingClientRect();
      return rect.bottom > 80 && rect.top < window.innerHeight - 40;
    });
    if (!cardInView) {
      const projects = document.getElementById('projects');
      if (projects) window.scrollTo({ top: projects.getBoundingClientRect().top + window.scrollY - 80, behavior: 'instant' });
    }
  };

  useEffect(() => {
    if (!hackerMode) return;
    const exit = event => { if (event.key === 'Escape') setHackerMode(false); };
    window.addEventListener('keydown', exit);
    return () => window.removeEventListener('keydown', exit);
  }, [hackerMode]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setNavHidden(y > lastY && y > 80);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className='web-portfolio' data-hacker-mode={hackerMode ? 'on' : 'off'}>
      <div className={`web-navbar navbar fixed top-0 left-0 right-0 z-50 bg-base-300/50 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10 px-3 md:px-6 shadow-sm transition-transform duration-300 ${navHidden && !mobileMenuOpen && !hackerMode ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className='navbar-start w-auto flex-1'>
          <p className='text-base sm:text-lg md:text-xl font-bold'>JusteenDev</p>
        </div>
        <div className='navbar-center'></div>
        <div className='navbar-end w-auto'>
          <div className='hidden lg:flex gap-1 items-center'>
            <button type='button' className='btn btn-ghost btn-sm sm:btn-md' onClick={onSwitchView} title='Switch portfolio view'>
              <MonitorCog className='h-4 w-4' />
              View
            </button>
            <a className='btn btn-ghost btn-sm sm:btn-md' href="#about">About</a>
            <a className='btn btn-ghost btn-sm sm:btn-md' href="#services">Services</a>
            <a className='btn btn-ghost btn-sm sm:btn-md' href="#tools">Tools</a>
            <a className='btn btn-ghost btn-sm sm:btn-md' href="#contact">Contact</a>
            <HackerModeToggle enabled={hackerMode} onChange={changeHackerMode} />
          </div>

          <div className='relative lg:hidden'>
            <button
              type='button'
              className='btn btn-ghost btn-square btn-sm'
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(open => !open)}
            >
              {mobileMenuOpen ? (
                <span className='text-2xl leading-none' aria-hidden='true'>×</span>
              ) : (
                <svg aria-hidden='true' viewBox='0 0 24 24' className='w-5 h-5 fill-none stroke-current stroke-2'>
                  <path d='M4 6h16M4 12h16M4 18h16' strokeLinecap='round' />
                </svg>
              )}
            </button>

            {mobileMenuOpen && (
              <div className='absolute right-0 top-full mt-3 w-44 p-2 rounded-2xl bg-base-300/70 backdrop-blur-xl backdrop-saturate-150 border border-white/10 shadow-xl flex flex-col'>
                {[
                  ['Switch View', null],
                  ['About', '#about'],
                  ['Services', '#services'],
                  ['Tools', '#tools'],
                  ['Contact', '#contact'],
                ].map(([label, href]) => href ? (
                  <a
                    key={href}
                    href={href}
                    className='btn btn-ghost justify-start'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </a>
                ) : (
                  <button
                    key={label}
                    type='button'
                    className='btn btn-ghost justify-start'
                    onClick={() => { setMobileMenuOpen(false); onSwitchView(); }}
                  >
                    <MonitorCog className='h-4 w-4' />
                    {label}
                  </button>
                ))}
                <HackerModeToggle enabled={hackerMode} onChange={changeHackerMode} />
              </div>
            )}
          </div>
        </div>
      </div>

      <section className='web-hero grid min-h-screen min-h-dvh place-items-center px-5 pb-[clamp(1.5rem,6dvh,4rem)] pt-[max(5rem,12dvh)]'>
        <div className='w-full max-w-xl text-center text-white'>
          <p className='web-eyebrow mb-5'>PORTFOLIO / JUSTEENDEV</p>
          <div className='min-h-28 sm:min-h-32'>
            <TextType className='text-3xl sm:text-4xl md:text-5xl font-extrabold' text={["Hello, I am JusteenDev", "A Fullstack Developer"]} typingSpeed={75} pauseDuration={1500} showCursor cursorCharacter='|' deletingSpeed={50} cursorBlinkDuration={0.5} />
          </div>
          <div className='py-4 sm:py-6'>
            <p className='text-lg sm:text-xl font-semibold'>"Simplicity is prerequisite for reliability."</p>
            <p className='mt-2 text-sm text-white/60'>Edsger W. Dijkstra</p>
          </div>
          <a href='#projects' className='btn btn-outline mt-3 border-white/20'>Explore projects</a>
        </div>
      </section>

      <SwarmRebuild enabled={hackerMode} paused={viewChooserOpen} replay={replay} contentKey={showAllTools}>
      <section id='projects' className='web-section scroll-mt-20 py-14 sm:py-20'>
        <div className='mx-auto max-w-6xl px-5 sm:px-8'>
          <div className='mb-8 flex flex-wrap items-end justify-between gap-5'>
            <div>
              <p className='web-eyebrow'>01 / PROJECT LAB</p>
              <h1 className='mt-3 text-3xl font-bold sm:text-4xl'>Projects</h1>
              <p className='mt-3 max-w-xl text-sm text-white/60'>Management system demos in development. Sample-data experiences are planned, not production systems.</p>
            </div>
            {hackerMode && (
              <div className='flex items-center gap-2'>
                <button type='button' className='btn btn-outline btn-sm' onClick={() => setReplay(value => value + 1)}><FaRedo aria-hidden='true' /> Replay rebuild</button>
                <button type='button' className='btn btn-ghost btn-sm' onClick={() => setHackerMode(false)}>Stop Hacker Mode</button>
              </div>
            )}
          </div>
          {hackerMode && (
            <p className='mb-5 flex items-center gap-2 text-xs text-emerald-200'>
              <FaSpider aria-hidden='true' />
              <span>Hacker Mode animation enabled. Cards rebuild one at a time as you scroll. Press Escape to stop.</span>
            </p>
          )}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {projectCards.map((project, index) => (
              <RebuildCard key={project.title}>
                <div className='web-card-meta' data-rebuild-part><span className='flex items-center gap-2'><FaCode aria-hidden='true' /> PRJ / {String(index + 1).padStart(2, '0')}</span><span>Planned demo</span></div>
                <h2 className='mt-6 text-lg font-bold' data-rebuild-part>{project.title}</h2>
                <p className='mt-3 flex-1 text-sm leading-relaxed text-white/60' data-rebuild-part>{project.description}</p>
                <div className='mt-6 border-t border-white/10 pt-4' data-rebuild-part>
                  {project.href ? <a className='btn btn-primary btn-sm w-full' href={project.href} target={project.external ? '_blank' : undefined} rel={project.external ? 'noopener noreferrer' : undefined}>{project.cta}</a> : <button type='button' className='btn btn-outline btn-sm w-full' disabled={project.disabled}>{project.cta}</button>}
                </div>
              </RebuildCard>
            ))}
          </div>
        </div>
      </section>

      <section id='tools' className='web-section scroll-mt-20 py-14 sm:py-20'>
        <div className='mx-auto max-w-6xl px-5 sm:px-8'>
          <div className='mb-8'>
            <p className='web-eyebrow'>02 / ENGINEERING WORKSPACE</p>
            <h1 className='mt-3 text-3xl font-bold sm:text-4xl'>Tools</h1>
            <p className='mt-3 text-sm text-white/60'>Engineering web tools: explore live utilities and what is coming next.</p>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {(showAllTools ? toolCards : toolCards.slice(0, 2)).map((tool, index) => (
              <RebuildCard key={tool.title}>
                <div className='web-card-meta' data-rebuild-part><span className='flex items-center gap-2'><FaCode aria-hidden='true' /> TOOL / {String(index + 1).padStart(2, '0')}</span><span className={tool.href ? 'text-emerald-300' : ''}>{tool.href ? 'Available' : 'Coming Soon'}</span></div>
                <h2 className='mt-6 text-lg font-bold' data-rebuild-part>{tool.title}</h2>
                <p className='mt-3 flex-1 text-sm leading-relaxed text-white/60' data-rebuild-part>{tool.description}</p>
                <div className='mt-6 border-t border-white/10 pt-4' data-rebuild-part>{tool.href ? <Link to={tool.href} className='btn btn-primary btn-sm w-full'>Open Tool</Link> : <span className='badge badge-outline text-white/50'>Coming Soon</span>}</div>
              </RebuildCard>
            ))}
          </div>
          {toolCards.length > 2 && <div className='flex justify-center pt-6'><button type='button' className='btn btn-outline bg-transparent border-white/30 hover:bg-white/5' onClick={() => setShowAllTools(value => !value)} aria-expanded={showAllTools}>{showAllTools ? 'Show Less' : `Show More (${toolCards.length - 2})`}</button></div>}
        </div>
      </section>

      <section id='services' className='web-section scroll-mt-20 py-14 sm:py-20'>
        <div className='mx-auto max-w-6xl px-5 sm:px-8'>
          <div className='mb-8'>
            <p className='web-eyebrow'>03 / DEVELOPMENT SERVICES</p>
            <h1 className='mt-3 text-3xl font-bold sm:text-4xl'>Services</h1>
            <p className='mt-3 text-sm text-white/60'>Focused development services for websites and student projects.</p>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {[...serviceCards, ...cardSwapCards.filter(item => !serviceCards.some(service => service.title === item.title))].map((service, index) => (
              <RebuildCard key={service.title}>
                <div className='web-card-meta' data-rebuild-part><span>SERVICE / {String(index + 1).padStart(2, '0')}</span><FaCode aria-hidden='true' /></div>
                <h2 className='mt-6 text-lg font-bold' data-rebuild-part>{service.title}</h2>
                <p className='mt-3 text-sm leading-relaxed text-white/60' data-rebuild-part>{service.description}</p>
              </RebuildCard>
            ))}
          </div>
        </div>
      </section>


      <div id='about' className='web-about hero relative min-h-screen scroll-mt-20'>
        <div className='hero-content relative z-10 flex-col lg:flex-row-reverse gap-8 lg:gap-16 max-w-6xl px-4 sm:px-6'>
          <img
            src='/logo.png'
            alt='JusteenDev logo'
            className='w-40 sm:w-52 lg:w-64 rounded-2xl shadow-lg'
          />
          <div className='text-center lg:text-left'>
            <h1 className='text-3xl sm:text-4xl font-bold'>About Me</h1>
            <p className='py-4 text-base sm:text-lg'>
              {portfolioProfile.bio}
            </p>
            <p className='text-sm sm:text-base opacity-80'>
              {portfolioProfile.freelance}
            </p>
            <div className='flex flex-wrap gap-2 justify-center lg:justify-start pt-4'>
              {technologies.map(tech => (
                <span key={tech} className='badge badge-outline'>{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section id='contact' className='web-section scroll-mt-20 py-14 sm:py-20'>
        <div className='mx-auto max-w-6xl px-5 sm:px-8'>
          <div className='mb-8'>
            <p className='web-eyebrow'>05 / LET’S CONNECT</p>
            <h1 className='mt-3 text-3xl font-bold sm:text-4xl'>Contact</h1>
            <p className='mt-3 text-sm text-white/60'>Get in touch with me for any inquiries or projects.</p>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {contactCards.map(contact => (
              <RebuildCard key={contact.title}>
                <a href={contact.href} target={contact.external ? '_blank' : undefined} rel={contact.external ? 'noopener noreferrer' : undefined} className='block'>
                  <h2 className='text-lg font-bold' data-rebuild-part>{contact.title}</h2>
                  <p className='mt-3 break-words text-sm text-white/60' data-rebuild-part>{contact.value}</p>
                </a>
              </RebuildCard>
            ))}
          </div>
          <div className='web-contact-form mx-auto mt-6 w-full max-w-xl'>
            <ContactForm />
          </div>
        </div>
      </section>
      </SwarmRebuild>
    </div>
  )
}

export default Portfolio
