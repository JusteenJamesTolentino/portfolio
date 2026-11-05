import { FaRegSmile, FaSpider } from 'react-icons/fa';

function HackerModeToggle({ enabled, onChange }) {
  return (
    <label className='hacker-toggle flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/5'>
      <span className='swap swap-rotate rounded-lg p-1'>
        <input type='checkbox' checked={enabled} onChange={event => onChange(event.target.checked)} aria-label='Hacker Mode' />
        <FaSpider className='swap-on h-5 w-5' aria-hidden='true' />
        <FaRegSmile className='swap-off h-5 w-5' aria-hidden='true' />
      </span>
      <span>Hacker Mode</span>
    </label>
  );
}

export default HackerModeToggle;
