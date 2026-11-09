import { FaEnvelope, FaFacebookF, FaInstagram } from 'react-icons/fa';
import TechStackMarquee from './TechStackMarquee';

function HeroAbout({ portfolioProfile, contactCards }) {
  const socialIcons = { Facebook: FaFacebookF, Instagram: FaInstagram, Email: FaEnvelope };

  return (
    <section id='home' className='web-hero relative flex min-h-screen min-h-dvh flex-col overflow-hidden' data-swarm-kind='surface' data-swarm-id='hero'>
      <div className='mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-end gap-10 px-5 pb-10 pt-[max(5.5rem,10dvh)] sm:px-8 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)_minmax(0,1fr)] xl:gap-8'>
        <div className='min-w-0 text-center text-white xl:text-left' data-swarm-group='hero-intro'>
          <span className='mx-auto mb-6 block h-px w-16 bg-white/60 xl:mx-0' aria-hidden='true' />
          <h1 className='text-balance text-3xl font-extrabold tracking-tight sm:text-4xl xl:text-[2.75rem] xl:leading-tight' data-swarm-kind='text' data-swarm-id='hero-title' data-swarm-text='Justeen Dev a Full Stack Developer'>
            Justeen Dev a Fullstack Developer
          </h1>
          <p className='mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70' data-swarm-kind='text' data-swarm-id='about-bio' data-swarm-text={portfolioProfile.bio}>
            {portfolioProfile.bio}
          </p>
        </div>

        <div className='order-first flex min-w-0 justify-center self-end xl:order-none' data-swarm-group='hero-logo'>
          <div className='web-hero-photo-stage w-72 max-w-full sm:w-80 lg:w-[24rem] xl:w-[28rem]'>
            <img
              src='/justeen-photo.png'
              alt='JusteenDev portrait'
              className='web-hero-photo w-full'
              data-swarm-kind='image'
              data-swarm-id='about-logo'
            />
          </div>
        </div>

        <div className='min-w-0 text-center text-white xl:text-left' data-swarm-group='about-content'>
          <p className='web-eyebrow' data-swarm-kind='text' data-swarm-id='about-heading' data-swarm-text='ABOUT ME'>ABOUT ME</p>
          <p className='mt-3 text-sm leading-relaxed text-white/70' data-swarm-kind='text' data-swarm-id='about-freelance' data-swarm-text={portfolioProfile.freelance}>
            {portfolioProfile.freelance}
          </p>

          <p className='web-eyebrow mt-8' data-swarm-kind='text' data-swarm-id='hero-work-label' data-swarm-text='MY WORK'>MY WORK</p>
          <p className='mt-3 text-sm leading-relaxed text-white/70' data-swarm-kind='text' data-swarm-id='hero-work-description' data-swarm-text='A selection of projects and interactive tools showing how I approach web and system development.'>
            A selection of projects and interactive tools showing how I approach web and system development.
          </p>
          <a href='#projects' className='hero-projects-cta mt-5 inline-flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-[0.18em]' data-swarm-kind='control' data-swarm-id='hero-work-button' data-swarm-text='VIEW PROJECTS'>
            VIEW PROJECTS
          </a>

          <p className='web-eyebrow mt-8' data-swarm-kind='text' data-swarm-id='hero-follow-label' data-swarm-text='FOLLOW ME'>FOLLOW ME</p>
          <div className='mt-3 flex justify-center gap-3 xl:justify-start'>
            {contactCards.map(contact => {
              const SocialIcon = socialIcons[contact.title] ?? FaEnvelope;
              return (
                <a
                  key={contact.title}
                  href={contact.href}
                  target={contact.external ? '_blank' : undefined}
                  rel={contact.external ? 'noopener noreferrer' : undefined}
                  aria-label={contact.title}
                  className='neu-btn inline-flex h-11 w-11 items-center justify-center rounded-full text-white/80'
                  data-swarm-kind='control'
                  data-swarm-id={`hero-social-${contact.title.toLowerCase()}`}
                  data-swarm-text={contact.title}
                >
                  <SocialIcon aria-hidden='true' />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className='relative z-10 border-y border-white/10' data-swarm-group='hero-tech'>
        <TechStackMarquee />
      </div>
    </section>
  );
}

export default HeroAbout;
