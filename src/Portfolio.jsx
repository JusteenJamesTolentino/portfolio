import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { MonitorCog } from 'lucide-react';
import { Link } from 'react-router-dom';
import TextType from './Components/ReactBits/TypingText';
import ContactForm from './Components/ContactForm';
import HackerModeToggle from './Components/HackerModeToggle';
import SwarmRebuild, { RebuildCard } from './Components/SwarmRebuild';
import { FaCode } from 'react-icons/fa';
import { projectCards } from './utils/projectCards';
import { serviceCards } from './utils/serviceCards';
import { cardSwapCards } from './utils/cardSwapCards';
import { contactCards } from './utils/contactCards';
import { toolCards } from './utils/toolCards';
import { portfolioProfile, technologies } from './data/portfolioProfile';

const FullSwarm = lazy(() => import('./Components/swarm/FullSwarm'));
const HERO_TITLES = ['Hello, I am JusteenDev', 'A Fullstack Developer'];

function Portfolio({ onSwitchView, viewChooserOpen = false }) {
  const rootRef = useRef(null);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);
  const [hackerMode, setHackerMode] = useState(false);
  const [swarmLive, setSwarmLive] = useState(false);

  const changeHackerMode = useCallback(enabled => {
    setSwarmLive(false);
    setHackerMode(enabled);
    setMobileMenuOpen(false);
    setNavHidden(false);
  }, []);

  const stopHackerMode = useCallback(() => changeHackerMode(false), [changeHackerMode]);

  useEffect(() => {
    if (!hackerMode || viewChooserOpen) return;
    const exit = event => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
        stopHackerMode();
      }
    };
    window.addEventListener('keydown', exit);
    return () => window.removeEventListener('keydown', exit);
  }, [hackerMode, viewChooserOpen, stopHackerMode]);

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
    <div ref={rootRef} className='web-portfolio' data-hacker-mode={hackerMode ? 'on' : 'off'}>
      <div data-swarm-nav className={`web-navbar navbar fixed top-0 left-0 right-0 z-50 bg-base-300/50 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10 px-3 md:px-6 shadow-sm transition-transform duration-300 ${navHidden && !mobileMenuOpen && !hackerMode ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className='navbar-start w-auto flex-1'>
          <p className='text-base sm:text-lg md:text-xl font-bold' data-swarm-kind='text' data-swarm-id='nav-brand' data-swarm-text='JusteenDev'>JusteenDev</p>
        </div>
        <div className='navbar-center'></div>
        <div className='navbar-end w-auto'>
          <div className='hidden lg:flex gap-1 items-center'>
            <button type='button' className='btn btn-ghost btn-sm sm:btn-md' onClick={onSwitchView} title='Switch portfolio view' data-swarm-kind='control' data-swarm-id='nav-view' data-swarm-text='View'>
              <MonitorCog className='h-4 w-4' aria-hidden='true' data-swarm-kind='image' data-swarm-id='nav-view-icon' />
              View
            </button>
            <a className='btn btn-ghost btn-sm sm:btn-md' href='#about' data-swarm-kind='control' data-swarm-id='nav-about' data-swarm-text='About'>About</a>
            <a className='btn btn-ghost btn-sm sm:btn-md' href='#services' data-swarm-kind='control' data-swarm-id='nav-services' data-swarm-text='Services'>Services</a>
            <a className='btn btn-ghost btn-sm sm:btn-md' href='#tools' data-swarm-kind='control' data-swarm-id='nav-tools' data-swarm-text='Tools'>Tools</a>
            <a className='btn btn-ghost btn-sm sm:btn-md' href='#contact' data-swarm-kind='control' data-swarm-id='nav-contact' data-swarm-text='Contact'>Contact</a>
            <div data-swarm-kind='control' data-swarm-id='nav-hacker-toggle' data-swarm-text='Hacker Mode'>
              <HackerModeToggle enabled={hackerMode} onChange={changeHackerMode} />
            </div>
          </div>

          <div className='relative lg:hidden'>
            <button
              type='button'
              className='btn btn-ghost btn-square btn-sm'
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(open => !open)}
              data-swarm-kind='control'
              data-swarm-id='nav-menu'
            >
              {mobileMenuOpen ? (
                <span className='text-2xl leading-none' aria-hidden='true' data-swarm-kind='image' data-swarm-id='nav-menu-icon'>×</span>
              ) : (
                <svg aria-hidden='true' viewBox='0 0 24 24' className='w-5 h-5 fill-none stroke-current stroke-2' data-swarm-kind='image' data-swarm-id='nav-menu-icon'>
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
                    data-swarm-kind='control'
                    data-swarm-id={`nav-mobile-${href.slice(1)}`}
                    data-swarm-text={label}
                  >
                    {label}
                  </a>
                ) : (
                  <button
                    key={label}
                    type='button'
                    className='btn btn-ghost justify-start'
                    onClick={() => { setMobileMenuOpen(false); onSwitchView(); }}
                    data-swarm-kind='control'
                    data-swarm-id='nav-mobile-view'
                    data-swarm-text={label}
                  >
                    <MonitorCog className='h-4 w-4' aria-hidden='true' data-swarm-kind='image' data-swarm-id='nav-mobile-view-icon' />
                    {label}
                  </button>
                ))}
                <div data-swarm-kind='control' data-swarm-id='nav-mobile-hacker-toggle' data-swarm-text='Hacker Mode'>
                  <HackerModeToggle enabled={hackerMode} onChange={changeHackerMode} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className='web-hero grid min-h-screen min-h-dvh place-items-center px-5 pb-[clamp(1.5rem,6dvh,4rem)] pt-[max(5rem,12dvh)]' data-swarm-group='hero' data-swarm-kind='surface' data-swarm-id='hero'>
        <div className='w-full max-w-xl text-center text-white'>
          <p className='web-eyebrow mb-5' data-swarm-kind='text' data-swarm-id='hero-eyebrow' data-swarm-text='PORTFOLIO / JUSTEENDEV'>PORTFOLIO / JUSTEENDEV</p>
          <div className='h-28 sm:h-32 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight' data-swarm-kind='text' data-swarm-id='hero-title' data-swarm-text='Hello, I am JusteenDev'>
            <TextType text={HERO_TITLES} paused={hackerMode && !swarmLive} typingSpeed={75} pauseDuration={1500} showCursor cursorCharacter='|' deletingSpeed={50} cursorBlinkDuration={0.5} cursorClassName='swarm-original-typing' />
          </div>
          <div className='py-4 sm:py-6'>
            <p className='text-lg sm:text-xl font-semibold' data-swarm-kind='text' data-swarm-id='hero-quote' data-swarm-text='"Simplicity is prerequisite for reliability."'>"Simplicity is prerequisite for reliability."</p>
            <p className='mt-2 text-sm text-white/60' data-swarm-kind='text' data-swarm-id='hero-quote-author' data-swarm-text='Edsger W. Dijkstra'>Edsger W. Dijkstra</p>
          </div>
          <a href='#projects' className='btn btn-outline mt-3 border-white/20' data-swarm-kind='control' data-swarm-id='hero-explore' data-swarm-text='Explore projects'>Explore projects</a>
        </div>
      </section>

      <SwarmRebuild enabled={hackerMode} paused={viewChooserOpen} contentKey={showAllTools}>
      <section id='projects' className='web-section scroll-mt-20 py-14 sm:py-20' data-swarm-kind='surface' data-swarm-id='projects'>
        <div className='mx-auto max-w-6xl px-5 sm:px-8'>
          <div className='mb-8 flex flex-wrap items-end justify-between gap-5' data-swarm-group='projects-heading'>
            <div>
              <p className='web-eyebrow' data-swarm-kind='text' data-swarm-id='projects-eyebrow' data-swarm-text='01 / PROJECT LAB'>01 / PROJECT LAB</p>
              <h1 className='mt-3 text-3xl font-bold sm:text-4xl' data-swarm-kind='text' data-swarm-id='projects-heading' data-swarm-text='Projects'>Projects</h1>
              <p className='mt-3 max-w-xl text-sm text-white/60' data-swarm-kind='text' data-swarm-id='projects-description' data-swarm-text='Management system demos in development. Sample-data experiences are planned, not production systems.'>Management system demos in development. Sample-data experiences are planned, not production systems.</p>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {projectCards.map((project, index) => (
              <RebuildCard key={project.title} blueprintId={`project-${index}`}>
                <div className='web-card-meta' data-rebuild-part>
                  <span className='flex items-center gap-2' data-swarm-kind='text' data-swarm-id={`project-${index}-meta`} data-swarm-text={`PRJ / ${String(index + 1).padStart(2, '0')}`}><FaCode aria-hidden='true' data-swarm-kind='image' data-swarm-id={`project-${index}-icon`} /> PRJ / {String(index + 1).padStart(2, '0')}</span>
                  <span data-swarm-kind='text' data-swarm-id={`project-${index}-status`} data-swarm-text='Planned demo'>Planned demo</span>
                </div>
                <h2 className='mt-6 text-lg font-bold' data-rebuild-part data-swarm-kind='text' data-swarm-id={`project-${index}-title`} data-swarm-text={project.title}>{project.title}</h2>
                <p className='mt-3 flex-1 text-sm leading-relaxed text-white/60' data-rebuild-part data-swarm-kind='text' data-swarm-id={`project-${index}-description`} data-swarm-text={project.description}>{project.description}</p>
                <div className='mt-6 border-t border-white/10 pt-4' data-rebuild-part>
                  {project.href ? <a className='btn btn-primary btn-sm w-full' href={project.href} target={project.external ? '_blank' : undefined} rel={project.external ? 'noopener noreferrer' : undefined} data-swarm-kind='control' data-swarm-id={`project-${index}-action`} data-swarm-text={project.cta}>{project.cta}</a> : <button type='button' className='btn btn-outline btn-sm w-full' disabled={project.disabled} data-swarm-kind='control' data-swarm-id={`project-${index}-action`} data-swarm-text={project.cta}>{project.cta}</button>}
                </div>
              </RebuildCard>
            ))}
          </div>
        </div>
      </section>

      <section id='tools' className='web-section scroll-mt-20 py-14 sm:py-20' data-swarm-kind='surface' data-swarm-id='tools'>
        <div className='mx-auto max-w-6xl px-5 sm:px-8'>
          <div className='mb-8' data-swarm-group='tools-heading'>
            <p className='web-eyebrow' data-swarm-kind='text' data-swarm-id='tools-eyebrow' data-swarm-text='02 / ENGINEERING WORKSPACE'>02 / ENGINEERING WORKSPACE</p>
            <h1 className='mt-3 text-3xl font-bold sm:text-4xl' data-swarm-kind='text' data-swarm-id='tools-heading' data-swarm-text='Tools'>Tools</h1>
            <p className='mt-3 text-sm text-white/60' data-swarm-kind='text' data-swarm-id='tools-description' data-swarm-text='Engineering web tools: explore live utilities and what is coming next.'>Engineering web tools: explore live utilities and what is coming next.</p>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {(showAllTools ? toolCards : toolCards.slice(0, 2)).map((tool, index) => (
              <RebuildCard key={tool.title} blueprintId={`tool-${index}`}>
                <div className='web-card-meta' data-rebuild-part>
                  <span className='flex items-center gap-2' data-swarm-kind='text' data-swarm-id={`tool-${index}-meta`} data-swarm-text={`TOOL / ${String(index + 1).padStart(2, '0')}`}><FaCode aria-hidden='true' data-swarm-kind='image' data-swarm-id={`tool-${index}-icon`} /> TOOL / {String(index + 1).padStart(2, '0')}</span>
                  <span className={tool.href ? 'text-emerald-300' : ''} data-swarm-kind='text' data-swarm-id={`tool-${index}-status`} data-swarm-text={tool.href ? 'Available' : 'Coming Soon'}>{tool.href ? 'Available' : 'Coming Soon'}</span>
                </div>
                <h2 className='mt-6 text-lg font-bold' data-rebuild-part data-swarm-kind='text' data-swarm-id={`tool-${index}-title`} data-swarm-text={tool.title}>{tool.title}</h2>
                <p className='mt-3 flex-1 text-sm leading-relaxed text-white/60' data-rebuild-part data-swarm-kind='text' data-swarm-id={`tool-${index}-description`} data-swarm-text={tool.description}>{tool.description}</p>
                <div className='mt-6 border-t border-white/10 pt-4' data-rebuild-part>{tool.href ? <Link to={tool.href} className='btn btn-primary btn-sm w-full' data-swarm-kind='control' data-swarm-id={`tool-${index}-action`} data-swarm-text='Open Tool'>Open Tool</Link> : <span className='badge badge-outline text-white/50' data-swarm-kind='control' data-swarm-id={`tool-${index}-badge`} data-swarm-text='Coming Soon'>Coming Soon</span>}</div>
              </RebuildCard>
            ))}
          </div>
          {toolCards.length > 2 && <div className='flex justify-center pt-6' data-swarm-group='tools-more'><button type='button' className='btn btn-outline bg-transparent border-white/30 hover:bg-white/5' onClick={() => setShowAllTools(value => !value)} aria-expanded={showAllTools} data-swarm-kind='control' data-swarm-id='tools-expand' data-swarm-text={showAllTools ? 'Show Less' : `Show More (${toolCards.length - 2})`}>{showAllTools ? 'Show Less' : `Show More (${toolCards.length - 2})`}</button></div>}
        </div>
      </section>

      <section id='services' className='web-section scroll-mt-20 py-14 sm:py-20' data-swarm-kind='surface' data-swarm-id='services'>
        <div className='mx-auto max-w-6xl px-5 sm:px-8'>
          <div className='mb-8' data-swarm-group='services-heading'>
            <p className='web-eyebrow' data-swarm-kind='text' data-swarm-id='services-eyebrow' data-swarm-text='03 / DEVELOPMENT SERVICES'>03 / DEVELOPMENT SERVICES</p>
            <h1 className='mt-3 text-3xl font-bold sm:text-4xl' data-swarm-kind='text' data-swarm-id='services-heading' data-swarm-text='Services'>Services</h1>
            <p className='mt-3 text-sm text-white/60' data-swarm-kind='text' data-swarm-id='services-description' data-swarm-text='Focused development services for websites and student projects.'>Focused development services for websites and student projects.</p>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {[...serviceCards, ...cardSwapCards.filter(item => !serviceCards.some(service => service.title === item.title))].map((service, index) => (
              <RebuildCard key={service.title} blueprintId={`service-${index}`}>
                <div className='web-card-meta' data-rebuild-part><span data-swarm-kind='text' data-swarm-id={`service-${index}-meta`} data-swarm-text={`SERVICE / ${String(index + 1).padStart(2, '0')}`}>SERVICE / {String(index + 1).padStart(2, '0')}</span><FaCode aria-hidden='true' data-swarm-kind='image' data-swarm-id={`service-${index}-icon`} /></div>
                <h2 className='mt-6 text-lg font-bold' data-rebuild-part data-swarm-kind='text' data-swarm-id={`service-${index}-title`} data-swarm-text={service.title}>{service.title}</h2>
                <p className='mt-3 text-sm leading-relaxed text-white/60' data-rebuild-part data-swarm-kind='text' data-swarm-id={`service-${index}-description`} data-swarm-text={service.description}>{service.description}</p>
              </RebuildCard>
            ))}
          </div>
        </div>
      </section>

      <section id='about' className='web-about hero relative min-h-screen scroll-mt-20' data-swarm-kind='surface' data-swarm-id='about'>
        <div className='hero-content relative z-10 flex-col lg:flex-row-reverse gap-8 lg:gap-16 max-w-6xl px-4 sm:px-6' data-swarm-group='about-content'>
          <img
            src='/logo.png'
            alt='JusteenDev logo'
            className='w-40 sm:w-52 lg:w-64 rounded-2xl shadow-lg'
            data-swarm-kind='image'
            data-swarm-id='about-logo'
          />
          <div className='text-center lg:text-left'>
            <h1 className='text-3xl sm:text-4xl font-bold' data-swarm-kind='text' data-swarm-id='about-heading' data-swarm-text='About Me'>About Me</h1>
            <p className='py-4 text-base sm:text-lg' data-swarm-kind='text' data-swarm-id='about-bio' data-swarm-text={portfolioProfile.bio}>
              {portfolioProfile.bio}
            </p>
            <p className='text-sm sm:text-base opacity-80' data-swarm-kind='text' data-swarm-id='about-freelance' data-swarm-text={portfolioProfile.freelance}>
              {portfolioProfile.freelance}
            </p>
            <div className='flex flex-wrap gap-2 justify-center lg:justify-start pt-4'>
              {technologies.map((tech, index) => (
                <span key={tech} className='badge badge-outline' data-swarm-kind='control' data-swarm-id={`about-tech-${index}`} data-swarm-text={tech}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id='contact' className='web-section scroll-mt-20 py-14 sm:py-20' data-swarm-kind='surface' data-swarm-id='contact'>
        <div className='mx-auto max-w-6xl px-5 sm:px-8'>
          <div className='mb-8' data-swarm-group='contact-heading'>
            <p className='web-eyebrow' data-swarm-kind='text' data-swarm-id='contact-eyebrow' data-swarm-text='05 / LET’S CONNECT'>05 / LET’S CONNECT</p>
            <h1 className='mt-3 text-3xl font-bold sm:text-4xl' data-swarm-kind='text' data-swarm-id='contact-heading' data-swarm-text='Contact'>Contact</h1>
            <p className='mt-3 text-sm text-white/60' data-swarm-kind='text' data-swarm-id='contact-description' data-swarm-text='Get in touch with me for any inquiries or projects.'>Get in touch with me for any inquiries or projects.</p>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {contactCards.map((contact, index) => (
              <RebuildCard key={contact.title} blueprintId={`contact-${index}`}>
                <a href={contact.href} target={contact.external ? '_blank' : undefined} rel={contact.external ? 'noopener noreferrer' : undefined} className='block' data-swarm-kind='control' data-swarm-id={`contact-${index}-link`}>
                  <h2 className='text-lg font-bold' data-rebuild-part data-swarm-kind='text' data-swarm-id={`contact-${index}-title`} data-swarm-text={contact.title}>{contact.title}</h2>
                  <p className='mt-3 break-words text-sm text-white/60' data-rebuild-part data-swarm-kind='text' data-swarm-id={`contact-${index}-value`} data-swarm-text={contact.value}>{contact.value}</p>
                </a>
              </RebuildCard>
            ))}
          </div>
          <div className='web-contact-form mx-auto mt-6 w-full max-w-xl'>
            <ContactForm rebuild />
          </div>
        </div>
      </section>
      </SwarmRebuild>
      {hackerMode && (
        <Suspense fallback={null}>
          <FullSwarm rootRef={rootRef} paused={viewChooserOpen} onLiveChange={setSwarmLive} onStop={stopHackerMode} contentKey={showAllTools} />
        </Suspense>
      )}
    </div>
  );
}

export default Portfolio;
