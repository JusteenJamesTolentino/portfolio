import { TECH_ICONS } from '../data/techIcons';

export function TechIcon({ name, className = 'game-skill-icon' }) {
  const entry = TECH_ICONS[name];
  if (!entry) {
    return <span className={className}><span className='game-skill-monogram'>{name.slice(0, 2).toUpperCase()}</span></span>;
  }
  if (entry.monogram) {
    return (
      <span className={className} style={{ color: entry.color }}>
        <span className='game-skill-monogram'>{entry.monogram}</span>
      </span>
    );
  }
  const Icon = entry.Icon;
  return (
    <span className={className} style={{ color: entry.color }}>
      <Icon aria-hidden='true' />
    </span>
  );
}
