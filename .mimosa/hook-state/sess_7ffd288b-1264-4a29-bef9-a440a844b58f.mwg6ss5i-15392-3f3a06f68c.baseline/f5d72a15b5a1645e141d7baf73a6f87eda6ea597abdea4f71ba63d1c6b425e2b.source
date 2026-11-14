import { TECH_ICONS } from '../data/techIcons';

const STACK = Object.entries(TECH_ICONS).map(([name, entry]) => ({ name, ...entry }));

function StackSet({ duplicate = false }) {
  return (
    <ul className='tech-stack-set' aria-label={duplicate ? undefined : 'Technology stack'} aria-hidden={duplicate ? 'true' : undefined}>
      {STACK.map(({ name, Icon, monogram, color }, index) => {
        const key = `${duplicate ? 'copy' : 'primary'}-${name}`;
        return (
          <li
            key={key}
            className='tech-stack-item'
            data-swarm-kind={duplicate ? undefined : 'control'}
            data-swarm-id={duplicate ? undefined : `hero-tech-${index}`}
            data-swarm-text={duplicate ? undefined : name}
            style={{ '--tech-color': color }}
          >
            <span className='tech-stack-icon' aria-hidden='true'>
              {Icon ? <Icon /> : <span className='tech-stack-monogram'>{monogram}</span>}
            </span>
            <span>{name}</span>
          </li>
        );
      })}
    </ul>
  );
}

function TechStackMarquee() {
  return (
    <div className='tech-stack-marquee' data-swarm-group='hero-tech'>
      <div className='tech-stack-track'>
        <StackSet />
        <StackSet duplicate />
      </div>
    </div>
  );
}

export default TechStackMarquee;
