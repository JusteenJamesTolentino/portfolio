import { useEffect, useRef, useState } from 'react';
import ContactForm from '../Components/ContactForm';
import { projectCards } from '../utils/projectCards';
import { serviceCards } from '../utils/serviceCards';
import { toolCards } from '../utils/toolCards';
import { contactCards } from '../utils/contactCards';
import { portfolioProfile, technologyGroups } from '../data/portfolioProfile';
import { TechIcon } from './TechIcon';
import {
  FaBolt,
  FaCompass,
  FaEnvelope,
  FaFacebookF,
  FaFileSignature,
  FaHeadset,
  FaInstagram,
  FaListUl,
} from 'react-icons/fa6';

const BOOT_LINES = [
  '> initializing justeendev.sys ...',
  '> mounting quest database ............ OK',
  '> loading skill matrix .............. OK',
  '> establishing comms link ........... OK',
  '> welcome, visitor_01',
];

const LOADING_TIPS = [
  'TIP: Enable Hacker Mode in the navbar to watch the swarm rebuild',
  'TIP: The tech rail pauses while you hover it',
  'TIP: Quests unlock as the projects ship',
  'TIP: Try the OS View for a full desktop experience',
  'TIP: The Serial Monitor talks to real hardware over USB',
];

const NAV_PANELS = [
  { id: 'home', label: 'Home', Icon: FaCompass },
  { id: 'quests', label: 'Quests', Icon: FaListUl },
  { id: 'contracts', label: 'Contracts', Icon: FaFileSignature },
  { id: 'skills', label: 'Skills', Icon: FaBolt },
  { id: 'comms', label: 'Comms', Icon: FaHeadset },
];

const PANEL_TITLES = {
  home: 'PLAYER TERMINAL',
  quests: 'QUEST LOG',
  contracts: 'CONTRACTS',
  skills: 'SKILL MATRIX',
  comms: 'COMMS',
};

// Decorative difficulty: stable per project, never a claim of real difficulty.
const difficultyFor = index => 2 + (index % 3);
const XP_PER_QUEST = 190;

function GameShell({ onSwitchView }) {
  // The loading screen is part of the Game View experience and always shows;
  // reduced motion only disables its flicker/glitch animations via CSS.
  const [phase, setPhase] = useState('loading');
  const [progress, setProgress] = useState(0);
  const [panel, setPanel] = useState('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const cardRef = useRef(null);

  const handleCardMove = event => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--tilt-x', `${(-py * 16).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${(px * 18).toFixed(2)}deg`);
  };

  const handleCardLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  useEffect(() => {
    if (phase !== 'loading') return undefined;
    const timer = window.setInterval(() => {
      setProgress(value => Math.min(100, value + 2));
    }, 60);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'loading' || progress < 100) return undefined;
    const timeout = window.setTimeout(() => setPhase('ready'), 450);
    return () => window.clearTimeout(timeout);
  }, [phase, progress]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const close = event => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [drawerOpen]);

  const openPanel = id => {
    setPanel(id);
    setDrawerOpen(false);
  };

  const quests = projectCards.length;
  const socialIcons = { Facebook: FaFacebookF, Instagram: FaInstagram, Email: FaEnvelope };
  const flipCard = () => setCardFlipped(flipped => !flipped);

  if (phase === 'loading') {
    const shownLines = Math.max(1, Math.min(BOOT_LINES.length, Math.ceil(progress / 22)));
    const tip = LOADING_TIPS[Math.min(LOADING_TIPS.length - 1, Math.floor(progress / 21))];
    return (
      <div className='game-loading' role='status' aria-label='Loading game view'>
        <div className='game-loading-frame'>
          <img src='/logo.png' alt='' className='game-loading-logo' aria-hidden='true' />
          <p className='game-loading-title game-glitch' data-text='JUSTEENDEV.SYS'>JUSTEENDEV.SYS</p>
          <p className='game-loading-sub'>SYS BOOT SEQUENCE</p>
          <div className='game-loading-bar'>
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className='game-loading-percent'>{progress}%</p>
          <ul className='game-loading-log'>
            {BOOT_LINES.slice(0, shownLines).map(line => <li key={line}>{line}</li>)}
          </ul>
          <p className='game-loading-tip'>{tip}</p>
        </div>
      </div>
    );
  }

  const navButtons = () => (
    <>
      {NAV_PANELS.map(item => (
        <button
          key={item.id}
          type='button'
          className={`game-nav-btn ${panel === item.id ? 'active' : ''}`}
          onClick={() => openPanel(item.id)}
          aria-pressed={panel === item.id}
        >
          <item.Icon aria-hidden='true' />
          <span>{item.label}</span>
        </button>
      ))}
    </>
  );

  const playerBlock = (
    <div className='game-player'>
      <img src='/logo.png' alt='' className='game-avatar' />
      <div className='game-player-meta'>
        <span className='game-callsign'>{portfolioProfile.brand}</span>
        <span className='game-class'>{portfolioProfile.role}</span>
        <div className='game-xp' role='img' aria-label={`Level 12, ${quests * XP_PER_QUEST} of 1000 XP`}>
          <span className='game-xp-bar' style={{ width: `${Math.min(96, quests * XP_PER_QUEST / 10)}%` }} />
        </div>
      </div>
      <div className='game-level'>LV<span>12</span></div>
    </div>
  );

  return (
    <div className='game-root'>
      <aside className='game-sidebar' aria-label='Game panels'>
        {playerBlock}
        <nav className='game-nav' aria-label='Game panels'>
          {navButtons(false)}
        </nav>
        <button type='button' className='game-exit' onClick={onSwitchView} aria-label='Switch portfolio view'>
          ⏻ SWITCH VIEW
        </button>
      </aside>

      {drawerOpen && (
        <>
          <button type='button' className='game-drawer-backdrop' aria-label='Close menu' onClick={() => setDrawerOpen(false)} />
          <aside className='game-drawer' aria-label='Game panels'>
            {playerBlock}
            <nav className='game-nav' aria-label='Game panels'>
              {navButtons(true)}
            </nav>
            <button type='button' className='game-exit' onClick={onSwitchView}>
              ⏻ SWITCH VIEW
            </button>
          </aside>
        </>
      )}

      <div className='game-body'>
        <header className='game-topbar'>
          <button
            type='button'
            className='game-burger lg:hidden'
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(open => !open)}
          >
            <span /><span /><span />
          </button>
          <span className='game-topbar-title'>{PANEL_TITLES[panel]}</span>
          <span className='game-status online'>ONLINE</span>
        </header>

        <main className='game-main'>
          {panel === 'home' && (
            <section className='game-panel game-home' aria-label='Home'>
              <div
                className={`game-card3d ${cardFlipped ? 'flipped' : ''}`}
                ref={cardRef}
                role='button'
                tabIndex={0}
                aria-pressed={cardFlipped}
                aria-label={cardFlipped ? 'Player card, flipped to social links. Activate to flip back' : 'Player card. Activate to flip and show social links'}
                onClick={flipCard}
                onPointerMove={handleCardMove}
                onPointerLeave={handleCardLeave}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    flipCard();
                  }
                }}
              >
                <div className='game-card3d-tilt'>
                  <div className='game-card3d-inner'>
                    <div className='game-card3d-face game-card3d-base'>
                      <img src='/logo.png' alt='JusteenDev logo' className='game-card3d-logo' />
                      <h2 className='game-card3d-name'>{portfolioProfile.brand}</h2>
                      <p className='game-card3d-class'>{portfolioProfile.role}</p>
                      <div className='game-xp' role='img' aria-label={`Level 12, ${quests * XP_PER_QUEST} of 1000 XP`}>
                        <span className='game-xp-bar' style={{ width: `${Math.min(96, quests * XP_PER_QUEST / 10)}%` }} />
                      </div>
                      <p className='game-card3d-flip-hint'>▲ CLICK TO FLIP ▲</p>
                    </div>
                    <div className='game-card3d-face game-card3d-back' aria-hidden={!cardFlipped}>
                      <ul className='game-card3d-socials'>
                        {contactCards.map(contact => {
                          const SocialIcon = socialIcons[contact.title] ?? FaEnvelope;
                          return (
                            <li key={contact.title}>
                              <a
                                href={contact.href}
                                target={contact.external ? '_blank' : undefined}
                                rel={contact.external ? 'noopener noreferrer' : undefined}
                                aria-label={contact.title}
                                title={contact.title}
                                onClick={event => event.stopPropagation()}
                              >
                                <SocialIcon aria-hidden='true' />
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                      <p className='game-card3d-flip-hint'>▼ CLICK TO FLIP BACK ▼</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className='game-home-hint glitch-hover' data-text='CLICK THE CARD // FLIP FOR SOCIALS'>
                CLICK THE CARD // FLIP FOR SOCIALS
              </p>
              <div className='game-home-stats'>
                <div className='game-stat'><span className='game-stat-num'>{quests}</span><span>QUESTS</span></div>
                <div className='game-stat'><span className='game-stat-num'>{toolCards.length + serviceCards.length}</span><span>CONTRACTS</span></div>
                <div className='game-stat'><span className='game-stat-num'>{technologyGroups.reduce((total, group) => total + group.technologies.length, 0)}</span><span>SKILLS</span></div>
                <div className='game-stat'><span className='game-stat-num'>{contactCards.length}</span><span>COMMS</span></div>
              </div>
            </section>
          )}

          {panel === 'quests' && (
            <section className='game-panel' aria-label='Quest log'>
              <h1 className='game-panel-title game-glitch' data-text='QUEST LOG'>QUEST LOG <span className='game-panel-sub'>// {quests} missions available</span></h1>
              <ul className='game-quests'>
                {projectCards.map((project, index) => (
                  <li key={project.title} className={`game-quest ${project.disabled ? 'locked' : 'available'}`}>
                    <div className='game-quest-head'>
                      <span className='game-quest-id'>QUEST {String(index + 1).padStart(3, '0')}</span>
                      <span className='game-stars' aria-label={`Difficulty ${difficultyFor(index)} of 4`}>
                        {'★'.repeat(difficultyFor(index))}{'☆'.repeat(4 - difficultyFor(index))}
                      </span>
                      <span className={`game-status ${project.disabled ? 'locked' : 'available'}`}>
                        {project.disabled ? 'LOCKED' : 'MAIN QUEST'}
                      </span>
                    </div>
                    <h2>{project.title}</h2>
                    <p className='game-brief'>{project.description}</p>
                    <p className='game-reward'>REWARD: +{XP_PER_QUEST} XP · {project.cta}</p>
                  </li>
                ))}
              </ul>
              <div className='game-live-tools'>
                <h2>PLAYABLE TOOLS</h2>
                {toolCards.filter(tool => tool.href).map(tool => (
                  <a key={tool.title} href={tool.href} className='game-tool-link'>{tool.title} →</a>
                ))}
              </div>
            </section>
          )}

          {panel === 'contracts' && (
            <section className='game-panel' aria-label='Contracts'>
              <h1 className='game-panel-title game-glitch' data-text='CONTRACTS'>CONTRACTS <span className='game-panel-sub'>// available commissions</span></h1>
              <ul className='game-contracts'>
                {[...serviceCards, ...toolCards.map(tool => ({ title: tool.title, description: tool.description }))].map(service => (
                  <li key={service.title} className='game-contract'>
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>
                    <span className='game-contract-tag'>OPEN CONTRACT</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {panel === 'skills' && (
            <section className='game-panel' aria-label='Skills'>
              <h1 className='game-panel-title game-glitch' data-text='SKILL MATRIX'>SKILL MATRIX <span className='game-panel-sub'>// installed abilities</span></h1>
              {technologyGroups.map(group => (
                <div key={group.title} className='game-skill-group'>
                  <h2>{group.title}</h2>
                  <ul className='game-skills'>
                    {group.technologies.map(tech => (
                      <li key={tech} className='game-skill'>
                        <TechIcon name={tech} />
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {panel === 'comms' && (
            <section className='game-panel' aria-label='Comms'>
              <h1 className='game-panel-title game-glitch' data-text='COMMS'>COMMS <span className='game-panel-sub'>// open channels</span></h1>
              <ul className='game-comms'>
                {contactCards.map(contact => (
                  <li key={contact.title} className='game-comm'>
                    <a href={contact.href} target={contact.external ? '_blank' : undefined} rel={contact.external ? 'noopener noreferrer' : undefined}>
                      <h2>{contact.title}</h2>
                      <p>{contact.value}</p>
                    </a>
                  </li>
                ))}
              </ul>
              <div className='game-form-frame'>
                <ContactForm />
              </div>
            </section>
          )}
        </main>

        <footer className='game-footer'>
          <span>JusteenDev // GAME v1.0</span>
          <span>INSERT COIN TO CONTINUE</span>
        </footer>
      </div>
    </div>
  );
}

export default GameShell;
