import { ArrowDown } from 'lucide-react';
import { FaEnvelope, FaFacebookF, FaInstagram } from 'react-icons/fa';
import TechStackMarquee from './TechStackMarquee';
import TextType from './ReactBits/TypingText';

function HeroAbout({ hackerMode, swarmLive, portfolioProfile, contactCards }) {
  const socialIcons = { Facebook: FaFacebookF, Instagram: FaInstagram, Email: FaEnvelope };

  return (
    <section id='home' className='web-hero relative flex min-h-screen min-h-dvh flex-col overflow-hidden' data-swarm-kind='surface' data-swarm-id='hero'>
      <div className='mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-end gap-10 px-5 pb-10 pt-[max(5.5rem,10dvh)] sm:px-8 md:grid-cols-[1.2fr_1.1fr_0.9fr] md:gap-8'>
        <div className='text-white' data-swarm-group='hero-intro'>
          <span className='mb-6 block h-px w-16 bg-white/60' aria-hidden='true' />
          <div className='min-h-24 text-3xl font-extrabold tracking-tight sm:min-h-28 sm:text-4xl md:text-[2.75rem] md:leading-tight' data-swarm-kind='text' data-swarm-id='hero-title' data-swarm-text='Hello, I am JusteenDev'>
            <TextType text={['Hello, I am JusteenDev', 'A Fullstack Developer']} paused={hackerMode && !swarmLive} typingSpeed={75} pauseDuration={1500} showCursor cursorCharacter='|' deletingSpeed={50} cursorBlinkDuration={0.5} cursorClassName='swarm-original-typing' />
          </div>
          <p className='mt-4 max-w-md text-sm leading-relaxed text-white/70' data-swarm-kind='text' data-swarm-id='about-bio' data-swarm-text={portfolioProfile.bio}>
            {portfolioProfile.bio}
          </p>
          <a href='#projects' aria-label='Scroll to projects' className='neu-btn mt-8 inline-flex h-14 w-14 items-center justify-center rounded-full text-white' data-swarm-kind='control' data-swarm-id='hero-scroll'>
            <ArrowDown className='h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5' aria-hidden='true' />
          </a>
        </div>

        <div className='order-first flex justify-center self-end md:order-none' data-swarm-group='hero-logo'>
          <img
            src='/justeen-photo.png'
            alt='JusteenDev portrait'
            className='web-hero-photo w-72 sm:w-80 md:w-[24rem] lg:w-[28rem] max-w-none'
            data-swarm-kind='image'
            data-swarm-id='about-logo'
          />
        </div>

        <div className='text-center text-white md:text-left' data-swarm-group='about-content'>
          <p className='web-eyebrow' data-swarm-kind='text' data-swarm-id='about-heading' data-swarm-text='ABOUT ME'>ABOUT ME</p>
          <p className='mt-3 text-sm leading-relaxed text-white/70' data-swarm-kind='text' data-swarm-id='about-freelance' data-swarm-text={portfolioProfile.freelance}>
            {portfolioProfile.freelance}
          </p>

          <p className='web-eyebrow mt-8' data-swarm-kind='text' data-swarm-id='hero-work-label' data-swarm-text='MY WORK'>MY WORK</p>
          <p className='mt-3 text-sm leading-relaxed text-white/70' data-swarm-kind='text' data-swarm-id='hero-work-description' data-swarm-text='A selection of projects and interactive tools showing how I approach web and system development.'>
            A selection of projects and interactive tools showing how I approach web and system development.
          </p>
          <a href='#projects' className='neu-btn mt-5 inline-flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-[0.18em] text-white' data-swarm-kind='control' data-swarm-id='hero-work-button' data-swarm-text='VIEW PROJECTS'>
            VIEW PROJECTS
          </a>

          <p className='web-eyebrow mt-8' data-swarm-kind='text' data-swarm-id='hero-follow-label' data-swarm-text='FOLLOW ME'>FOLLOW ME</p>
          <div className='mt-3 flex justify-center gap-3 md:justify-start'>
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
