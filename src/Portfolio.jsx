import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TextType from './Components/ReactBits/TypingText';
import ClickSpark from './Components/ReactBits/ClickSpark';
import CardSwap, { Card } from './Components/ReactBits/CardSwap';
import ContactForm from './Components/ContactForm';
import ScrollZoomHero from './Components/ScrollZoomHero';
import { projectCards } from './utils/projectCards';
import { serviceCards } from './utils/serviceCards';
import { cardSwapCards } from './utils/cardSwapCards';
import { contactCards } from './utils/contactCards';
import { toolCards } from './utils/toolCards';

function Portfolio() {
  const [navHidden, setNavHidden] = useState(false);

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
    <ClickSpark className="overflow-x-hidden" sparkColor='#fff' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      <div className={`navbar fixed top-0 left-0 right-0 z-50 bg-base-300/50 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10 px-3 md:px-6 shadow-sm transition-transform duration-300 ${navHidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className='navbar-start'>
          <p className='text-base sm:text-lg md:text-xl font-bold'>JusteenDev</p>
        </div>
        <div className='navbar-center'></div>
        <div className='navbar-end gap-1 sm:gap-2'>
          <a className='btn btn-ghost btn-sm sm:btn-md' href="#about">About</a>
          <a className='btn btn-ghost btn-sm sm:btn-md' href="#services">Services</a>
          <a className='btn btn-ghost btn-sm sm:btn-md' href="#tools">Tools</a>
          <a className='btn btn-ghost btn-sm sm:btn-md' href="#contact">Contact</a>
        </div>
      </div>

      <ScrollZoomHero secondImage='/about-night-lamp.jpg'>
        <div className='max-w-md text-white'>
          <TextType className='text-3xl sm:text-4xl md:text-5xl font-extrabold' text={["Hello, I am JusteenDev", "A Fullstack Developer"]} typingSpeed={75} pauseDuration={1500} showCursor cursorCharacter='|' deletingSpeed={50} cursorBlinkDuration={0.5} />
          <div className='py-4 sm:py-6'>
            <p className='text-lg sm:text-xl font-semibold'> "Simplicity is prerequisite for reliability."</p>
            <p className='opacity-80'>Edsger W. Dijkstra</p>
          </div>
        </div>
      </ScrollZoomHero>

      <div id='about' className='hero relative min-h-screen scroll-mt-16 bg-cover bg-center bg-no-repeat' style={{ backgroundImage: "url('/about-night-lamp.jpg')" }}>
        <div className='absolute inset-0 bg-black/70' aria-hidden='true'></div>
        <div className='hero-content relative z-10 flex-col lg:flex-row-reverse gap-8 lg:gap-16 max-w-6xl px-4 sm:px-6'>
          <img
            src='/logo.png'
            alt='JusteenDev logo'
            className='w-40 sm:w-52 lg:w-64 rounded-2xl shadow-lg'
          />
          <div className='text-center lg:text-left'>
            <h1 className='text-3xl sm:text-4xl font-bold'>About Me</h1>
            <p className='py-4 text-base sm:text-lg'>
              I&apos;m Justeen, a fullstack web developer who believes simplicity is the shortest
              path to reliable software. I build complete web applications, from responsive
              frontends to APIs and the databases behind them.
            </p>
            <p className='text-sm sm:text-base opacity-80'>
              I also offer student-friendly freelance services, helping turn project ideas into
              working systems with clean, maintainable code.
            </p>
            <div className='flex flex-wrap gap-2 justify-center lg:justify-start pt-4'>
              {['React', 'Node.js', 'Firebase', 'Tailwind CSS', 'JavaScript'].map(tech => (
                <span key={tech} className='badge badge-outline'>{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id='projects' className='p-5 bg-neutral text-neutral-content scroll-mt-16'>
        <div className='w-full p-5 flex flex-col gap-4 items-start max-w-6xl mx-auto'>
          <div className='p-5'>
            <h1 className='text-3xl sm:text-4xl font-bold'>Projects</h1>
          </div>

          <div className='py-2 px-5'>
            <h1 className='text-xl sm:text-2xl font-bold'>Management Systems</h1>
          </div>

          <div className='flex flex-row flex-nowrap gap-2 p-2 pb-3 w-full overflow-x-auto shadow-sm'>
            {projectCards.map((project) => (
              <div key={project.title} className="card bg-base-300 w-60 flex-none shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">{project.title}</h2>
                  <p>{project.description}</p>
                  <div className="card-actions justify-center py-5 hover:scale-105 transition-transform duration-300">
                    {project.href ? (
                      <a className="btn btn-primary w-full" href={project.href} target={project.external ? '_blank' : undefined} rel={project.external ? 'noopener noreferrer' : undefined}>{project.cta}</a>
                    ) : (
                      <button className="btn btn-primary w-full" disabled={project.disabled}>{project.cta}</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id='tools' className='min-h-screen bg-neutral text-neutral-content scroll-mt-16 py-16'>
        <div className='w-full max-w-6xl flex-col items-start text-left px-4 sm:px-6 mx-auto'>
          <div className='p-5'>
            <h1 className='text-3xl sm:text-4xl font-bold'>Tools</h1>
            <p className='mt-2 text-sm sm:text-base opacity-80'>Engineering web tools: free, fast, and running entirely in your browser.</p>
          </div>

          <div className='flex flex-row flex-wrap gap-4 items-stretch justify-center w-full px-2'>
            {toolCards.map((tool) => {
              const inner = (
                <>
                  <h2 className='text-lg sm:text-xl py-2 font-bold'>{tool.title}</h2>
                  <p className='text-sm text-center flex-1'>{tool.description}</p>
                  {tool.href ? (
                    <span className='btn btn-primary btn-sm mt-2'>Open Tool</span>
                  ) : (
                    <span className='badge badge-outline badge-sm mt-2'>Coming Soon</span>
                  )}
                </>
              );
              return tool.href ? (
                <Link
                  key={tool.title}
                  to={tool.href}
                  className='border border-white/40 rounded-lg p-4 w-72 shrink-0 flex flex-col items-center justify-start gap-2 hover:border-white/80 hover:-translate-y-1 transition-all duration-200'
                >
                  {inner}
                </Link>
              ) : (
                <div key={tool.title} className='border border-white/40 rounded-lg p-4 w-72 shrink-0 flex flex-col items-center justify-start gap-2'>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div id='services' className='hero min-h-screen bg-neutral text-neutral-content max-[768px]:place-items-start scroll-mt-16'>
        <div className='hero-content w-full max-w-6xl flex-col items-start text-left px-4 sm:px-6 max-[768px]:pt-6'>
          <div className='p-5'>
            <h1 className='text-3xl sm:text-4xl font-bold'>Services</h1>
            <p className='mt-2 text-sm sm:text-base opacity-80'>Focused development services for websites and student projects.</p>
          </div>

          <div className='flex flex-row flex-wrap gap-4 items-center justify-center w-full'>
            {serviceCards.map((service) => (
              <div key={service.title} className='border text-justify border-white/40 rounded-lg p-4 w-72 lg:w-80 h-40 lg:min-h-50 shrink-0 flex flex-col items-center gap-2 snap-start flex-none'>
                <h1 className='text-lg sm:text-xl py-2 font-bold'>{service.title}</h1>
                <p className='text-sm'>{service.description}</p>
              </div>
            ))}
          </div>

          <div className='relative w-full h-130 sm:h-140 md:h-150'>
            <CardSwap width={420} height={300} cardDistance={40} verticalDistance={48} delay={5000} pauseOnHover={false}>
              {cardSwapCards.map((cardItem) => (
                <Card key={cardItem.title} className='p-6 sm:p-8 flex flex-col justify-center gap-3 bg-black text-white border-white/40'>
                  <h3 className='text-xl sm:text-2xl font-bold'>{cardItem.title}</h3>
                  <p>{cardItem.description}</p>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>


      <div id='contact' className='hero min-h-screen bg-neutral text-neutral-content max-[768px]:place-items-start scroll-mt-16'>
        <div className='hero-content w-full max-w-6xl flex-col items-start text-left px-4 sm:px-6 max-[768px]:pt-6'>
          <div className='p-5'>
            <h1 className='text-3xl sm:text-4xl font-bold'>Contact</h1>
            <p className='mt-2 text-sm sm:text-base opacity-80'>Get in touch with me for any inquiries or projects.</p>
          </div>

          <div className='flex flex-row flex-wrap w-full gap-4 items-center justify-center'>
            {contactCards.map((contact) => (
              <div key={contact.title} className='border text-justify border-white/40 rounded-lg p-4 w-72 sm:w-80 min-h-40 shrink-0 flex flex-col items-center justify-center gap-2'>
                <a
                  href={contact.href}
                  target={contact.external ? '_blank' : undefined}
                  rel={contact.external ? 'noopener noreferrer' : undefined}
                  className='w-full text-center'
                >
                  <h1 className='text-lg sm:text-xl py-2 font-bold'>{contact.title}</h1>
                  <p className='text-sm opacity-80 wrap-break-word'>{contact.value}</p>
                </a>
              </div>
            ))}
          </div>
          <div className='w-full max-w-xl mx-auto'>
            <ContactForm />
          </div>

        </div>
      </div>

    </ClickSpark>
  )
}

export default Portfolio
