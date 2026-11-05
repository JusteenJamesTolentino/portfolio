import { useLayoutEffect, useRef } from 'react';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const ANIMATION_SPEED = 2;
const ENTRY_RATIO = 0.1;

export function RebuildCard({ children }) {
  return (
    <div className='rebuild-card-shell' data-rebuild-card>
      <article className='web-card'>{children}</article>
    </div>
  );
}

function createCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'swarm-cursor';
  cursor.style.color = '#6ee7b7';
  const arrow = document.createElementNS(SVG_NAMESPACE, 'svg');
  arrow.setAttribute('viewBox', '0 0 20 24');
  const path = document.createElementNS(SVG_NAMESPACE, 'path');
  path.setAttribute('d', 'M2 2L3 20L8 15L12 22L16 20L12 13L19 12Z');
  path.setAttribute('fill', 'currentColor');
  path.setAttribute('stroke', '#07130f');
  arrow.append(path);
  const name = document.createElement('span');
  name.textContent = 'builder';
  name.style.backgroundColor = '#6ee7b7';
  cursor.append(arrow, name);
  return cursor;
}

function viewportPosition(shell) {
  const rect = shell.getBoundingClientRect();
  const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
  const area = rect.width * rect.height;
  return { top: rect.top, inView: height > 0 && width > 0, ratio: area ? height * width / area : 0 };
}

function SwarmRebuild({ enabled, paused = false, replay = 0, contentKey, children }) {
  const containerRef = useRef(null);
  const sessionRef = useRef({ enabled: false, replay: 0, states: new WeakMap() });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const session = sessionRef.current;
    if (session.enabled !== enabled || session.replay !== replay) {
      session.states = new WeakMap();
      session.enabled = enabled;
      session.replay = replay;
    }

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shells = [...container.querySelectorAll('[data-rebuild-card]')];
    const positions = new Map();
    const animations = new Set();
    let active = null;
    let disposed = false;
    let scrollFrame = null;
    let lastY = window.scrollY;
    let direction = 1;

    const shouldAnimate = () => enabled || !motionPreference.matches;
    const hasFocus = shell => shell.contains(document.activeElement);
    const setState = (shell, state) => {
      session.states.set(shell, state);
      shell.dataset.scrollReveal = state;
    };
    const clearRun = () => {
      if (!active) return;
      const run = active;
      active = null;
      run.animations.forEach(animation => { animation.cancel(); animations.delete(animation); });
      run.layer?.remove();
      delete run.shell.dataset.rebuildRunning;
    };

    const processNext = () => {
      if (disposed || paused || active || document.hidden || !shouldAnimate()) return;
      const candidates = shells.filter(shell => {
        const position = positions.get(shell);
        return position?.ratio >= ENTRY_RATIO && session.states.get(shell) === 'pending';
      });
      candidates.sort((a, b) => {
        const difference = positions.get(a).top - positions.get(b).top;
        return difference === 0 ? shells.indexOf(a) - shells.indexOf(b) : difference * direction;
      });
      const shell = candidates[0];
      if (!shell) return;
      const position = viewportPosition(shell);
      if (position.ratio < ENTRY_RATIO) return;
      const card = shell.firstElementChild;
      const run = { shell, animations: [], layer: null };
      active = run;
      setState(shell, 'running');

      const animate = (element, frames, options) => {
        const animation = element.animate(frames, {
          ...options,
          duration: options.duration / ANIMATION_SPEED,
          delay: (options.delay ?? 0) / ANIMATION_SPEED,
        });
        animations.add(animation);
        run.animations.push(animation);
      };
      animate(card, [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'translateY(0)' }], {
        duration: 480, fill: 'both', easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
      });

      if (enabled) {
        shell.dataset.rebuildRunning = 'true';
        const layer = document.createElement('div');
        layer.className = 'swarm-layer';
        layer.setAttribute('aria-hidden', 'true');
        card.append(layer);
        run.layer = layer;
        const outline = document.createElementNS(SVG_NAMESPACE, 'svg');
        outline.setAttribute('viewBox', '0 0 100 100');
        outline.setAttribute('preserveAspectRatio', 'none');
        outline.classList.add('swarm-outline');
        const rect = document.createElementNS(SVG_NAMESPACE, 'rect');
        [['x', '1'], ['y', '1'], ['width', '98'], ['height', '98'], ['rx', '4'], ['pathLength', '100']].forEach(([name, value]) => rect.setAttribute(name, value));
        outline.append(rect);
        layer.append(outline);
        animate(rect, [{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }], { duration: 1100, fill: 'both', easing: 'ease-in-out' });
        const cursor = createCursor();
        layer.append(cursor);
        animate(cursor, [
          { left: '2%', top: '2%' }, { left: '90%', top: '2%' },
          { left: '90%', top: '85%' }, { left: '12%', top: '50%' }, { left: '65%', top: '80%' },
        ], { duration: 1850, fill: 'both', easing: 'ease-in-out' });
        card.querySelectorAll('[data-rebuild-part]').forEach((part, index) => {
          animate(part, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], {
            delay: 180 + index * 250, duration: 550, fill: 'both', easing: 'steps(18, end)',
          });
        });
        animate(layer, [{ opacity: 1, offset: 0 }, { opacity: 1, offset: 0.8 }, { opacity: 0, offset: 1 }], { duration: 2100, fill: 'both' });
      }
      Promise.all(run.animations.map(animation => animation.finished)).then(() => {
        if (disposed || active !== run) return;
        clearRun();
        setState(shell, viewportPosition(shell).inView || hasFocus(shell) ? 'revealed' : 'culled');
        refresh();
      }).catch(() => {
        // Cancellation is expected when a card leaves the viewport or the mode changes.
      });
    };

    const refresh = () => {
      if (disposed) return;
      shells.forEach(shell => {
        const position = viewportPosition(shell);
        positions.set(shell, position);
        const state = session.states.get(shell);
        if (hasFocus(shell)) {
          if (active?.shell === shell) clearRun();
          setState(shell, 'revealed');
        } else if (!position.inView) {
          if (active?.shell === shell) clearRun();
          setState(shell, 'culled');
        } else if (!shouldAnimate()) {
          setState(shell, 'revealed');
        } else if (!state || state === 'culled') {
          setState(shell, 'pending');
        }
      });
      processNext();
    };

    shells.forEach(shell => {
      if (session.states.get(shell) === 'running') setState(shell, 'pending');
    });
    refresh();
    const observer = new IntersectionObserver(refresh, { threshold: [0, ENTRY_RATIO] });
    shells.forEach(shell => observer.observe(shell));
    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(container);

    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) direction = y > lastY ? 1 : -1;
      lastY = y;
      if (scrollFrame === null) scrollFrame = requestAnimationFrame(() => {
        scrollFrame = null;
        refresh();
      });
    };
    const visibilityChanged = () => {
      refresh();
      animations.forEach(animation => {
        if (document.hidden && animation.playState === 'running') animation.pause();
        else if (!document.hidden && animation.playState === 'paused') animation.play();
      });
    };
    const motionChanged = () => {
      if (enabled) return;
      if (active) {
        const shell = active.shell;
        clearRun();
        setState(shell, 'pending');
      }
      refresh();
    };
    const focusChanged = () => {
      queueMicrotask(() => { if (!disposed) refresh(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', visibilityChanged);
    motionPreference.addEventListener('change', motionChanged);
    container.addEventListener('focusin', focusChanged);
    container.addEventListener('focusout', focusChanged);

    return () => {
      disposed = true;
      observer.disconnect();
      resizeObserver.disconnect();
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', visibilityChanged);
      motionPreference.removeEventListener('change', motionChanged);
      container.removeEventListener('focusin', focusChanged);
      container.removeEventListener('focusout', focusChanged);
      if (active) {
        const shell = active.shell;
        clearRun();
        session.states.set(shell, 'pending');
      }
      shells.forEach(shell => { delete shell.dataset.scrollReveal; });
    };
  }, [enabled, paused, replay, contentKey]);

  return <div ref={containerRef} className='swarm-workspace'>{children}</div>;
}

export default SwarmRebuild;
