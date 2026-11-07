import { useLayoutEffect, useRef } from 'react';

const ENTRY_RATIO = 0.1;

export function RebuildCard({ children, blueprintId }) {
  return (
    <div className='rebuild-card-shell' data-rebuild-card data-swarm-group={blueprintId}>
      <article className='web-card' data-swarm-kind='surface' data-swarm-id={blueprintId}>{children}</article>
    </div>
  );
}

function SwarmRebuild({ enabled, paused = false, contentKey, children }) {
  const containerRef = useRef(null);
  const statesRef = useRef(new WeakMap());

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || enabled) return;
    const states = statesRef.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shells = [...container.querySelectorAll('[data-rebuild-card]')];
    // Document-space geometry cache: scrolling becomes a pure paint update
    // with no per-frame layout reads.
    const geometry = new Map();
    const measure = () => {
      shells.forEach(shell => {
        const rect = shell.getBoundingClientRect();
        geometry.set(shell, { top: rect.top + window.scrollY, height: rect.height });
      });
    };
    let active = null;
    let disposed = false;
    let frame = null;
    let lastY = window.scrollY;
    let direction = 1;

    const state = (shell, value) => {
      states.set(shell, value);
      shell.dataset.scrollReveal = value;
    };
    const cancel = () => {
      if (!active) return;
      const run = active;
      active = null;
      run.animation.cancel();
      states.set(run.shell, 'pending');
    };
    const viewportPosition = shell => {
      const cached = geometry.get(shell) ?? { top: 0, height: 0 };
      const top = cached.top - window.scrollY;
      const height = Math.max(0, Math.min(top + cached.height, window.innerHeight) - Math.max(top, 0));
      return { top, inView: top + cached.height > 0 && top < window.innerHeight, ratio: cached.height ? height / cached.height : 0 };
    };
    const refresh = () => {
      if (disposed) return;
      const positions = new Map(shells.map(shell => [shell, viewportPosition(shell)]));
      shells.forEach(shell => {
        const position = positions.get(shell);
        if (shell.contains(document.activeElement)) {
          if (active?.shell === shell) cancel();
          state(shell, 'revealed');
        } else if (!position.inView) {
          if (active?.shell === shell) cancel();
          state(shell, 'culled');
        } else if (media.matches) {
          if (active?.shell === shell) cancel();
          state(shell, 'revealed');
        } else if (!states.has(shell) || states.get(shell) === 'culled') {
          state(shell, 'pending');
        }
      });
      if (active || paused || document.hidden || media.matches) return;
      const candidates = shells.filter(shell => positions.get(shell).ratio >= ENTRY_RATIO && states.get(shell) === 'pending');
      candidates.sort((a, b) => (positions.get(a).top - positions.get(b).top) * direction || shells.indexOf(a) - shells.indexOf(b));
      const shell = candidates[0];
      if (!shell) return;
      state(shell, 'running');
      const animation = shell.firstElementChild.animate([
        { opacity: 0, transform: 'translateY(28px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 240, fill: 'both', easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' });
      const run = { shell, animation };
      active = run;
      animation.finished.then(() => {
        if (disposed || active !== run) return;
        active = null;
        animation.cancel();
        state(shell, viewportPosition(shell).inView ? 'revealed' : 'culled');
        refresh();
      }).catch(() => {
        // Cancellation is expected on viewport exit, mode change, or unmount.
      });
    };
    shells.forEach(shell => { if (states.get(shell) === 'running') states.set(shell, 'pending'); });
    measure();
    refresh();
    const observer = new IntersectionObserver(refresh, { threshold: [0, ENTRY_RATIO] });
    shells.forEach(shell => observer.observe(shell));
    const resize = new ResizeObserver(() => { measure(); refresh(); });
    resize.observe(container);
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) direction = y > lastY ? 1 : -1;
      lastY = y;
      if (frame === null) frame = requestAnimationFrame(() => { frame = null; refresh(); });
    };
    const focus = () => queueMicrotask(() => { if (!disposed) refresh(); });
    const visibility = () => {
      refresh();
      if (active) { if (document.hidden) active.animation.pause(); else active.animation.play(); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', refresh);
    container.addEventListener('focusin', focus);
    container.addEventListener('focusout', focus);
    return () => {
      disposed = true;
      observer.disconnect();
      resize.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', visibility);
      media.removeEventListener('change', refresh);
      container.removeEventListener('focusin', focus);
      container.removeEventListener('focusout', focus);
      cancel();
      shells.forEach(shell => { delete shell.dataset.scrollReveal; });
    };
  }, [enabled, paused, contentKey]);

  return <div ref={containerRef} className='swarm-workspace'>{children}</div>;
}

export default SwarmRebuild;
