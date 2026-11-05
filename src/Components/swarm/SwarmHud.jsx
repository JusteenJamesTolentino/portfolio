import { FaPause, FaPlay, FaRedo, FaSpider, FaTimes } from 'react-icons/fa';

function SwarmHud({ stats, onPause, onSpeed, onReplay, onLive, onStop, onReduced, onFollow }) {
  const percent = stats.total ? Math.round(stats.done / stats.total * 100) : 0;
  const status = stats.live ? 'Live' : stats.paused ? 'Paused' : stats.operation === 'erase' ? 'Erasing outgoing group' : stats.operation === 'build' ? 'Building one group' : 'Waiting for viewport';
  return (
    <aside className='full-swarm-hud' aria-label='Full Swarm controls' data-swarm-preserve>
      <div className='full-swarm-hud-heading'>
        <span><FaSpider aria-hidden='true' /> Full Swarm</span>
        <span role='status' aria-live='polite' aria-atomic='true'>{status}</span>
      </div>
      <progress aria-label='Currently built page content' value={stats.done} max={Math.max(1, stats.total)} />
      <p>{stats.done}/{stats.total} visible tasks · {percent}% built · {stats.active} agents · {(stats.clock / 1000).toFixed(1)}s</p>
      {stats.owner && !stats.live && <p className='full-swarm-owner'>Group: {stats.owner}</p>}
      <div className='full-swarm-actions'>
        <button type='button' onClick={onPause} disabled={stats.live} aria-pressed={stats.userPaused} aria-label={stats.userPaused ? 'Resume Full Swarm' : 'Pause Full Swarm'}>
          {stats.userPaused ? <FaPlay aria-hidden='true' /> : <FaPause aria-hidden='true' />}
          {stats.userPaused ? 'Resume' : 'Pause'}
        </button>
        <button type='button' onClick={onSpeed} disabled={stats.live} aria-label={`Change animation speed, currently ${stats.speed} times`}>{stats.speed}×</button>
        <button type='button' onClick={onReplay}><FaRedo aria-hidden='true' /> Replay</button>
        <button type='button' onClick={onLive} disabled={stats.live}>Go Live</button>
        <button type='button' onClick={onStop}><FaTimes aria-hidden='true' /> Stop</button>
      </div>
      <div className='full-swarm-options'>
        <label><input type='checkbox' checked={stats.reduced} onChange={onReduced} disabled={stats.live} /> Less motion</label>
        <label><input type='checkbox' checked={stats.follow} onChange={onFollow} disabled={stats.live || stats.reduced} /> Follow tour</label>
      </div>
      <p className='full-swarm-help'>One group, multiple agents. Scroll to erase and rebuild. Go Live restores the whole page. Links and inputs stay usable. Escape exits.</p>
    </aside>
  );
}

export default SwarmHud;
