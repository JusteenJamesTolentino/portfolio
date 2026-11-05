import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { collectBlueprint, measureBlueprint } from './blueprint';
import { createScheduler } from './scheduler';
import { createScene } from './scene';
import SwarmHud from './SwarmHud';

function FullSwarm({ rootRef, paused, onLiveChange, onStop, contentKey }) {
  const controllerRef = useRef(null);
  const pauseRef = useRef(paused);
  const liveCallbackRef = useRef(onLiveChange);
  const [stats, setStats] = useState({ total: 0, done: 0, active: 0, clock: 0, paused: false, userPaused: false, speed: 1, live: false, reduced: false, follow: false, idle: true, owner: null, operation: null });

  useLayoutEffect(() => {
    pauseRef.current = paused;
    liveCallbackRef.current = onLiveChange;
    controllerRef.current?.wake();
  }, [paused, onLiveChange]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const count = window.innerWidth < 768 ? 3 : 6;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let tasks = collectBlueprint(root);
    const scheduler = createScheduler(tasks, count);
    let scene = createScene(root, tasks, count);
    let disposed = false;
    let speed = 1;
    let userPaused = false;
    let reduced = false;
    let follow = false;
    let live = false;
    let dirty = true;
    let collect = false;
    let frame = null;
    let lastTime = null;
    let lastPublish = 0;
    let lastY = window.scrollY;
    let direction = 1;
    let top = 0;
    let tourOrder = -1;
    let tourScroll = null;
    let anchorTarget = null;
    const previousStage = root.dataset.swarmStage;
    root.dataset.swarmStage = 'rebuilding';

    const blocked = () => userPaused || pauseRef.current || document.hidden;
    const publish = (snapshot = scheduler.snapshot()) => {
      if (disposed) return;
      setStats({ total: snapshot.total, done: snapshot.done, active: snapshot.active.length, clock: snapshot.clock, paused: blocked(), userPaused, speed, live, reduced, follow, idle: snapshot.idle, owner: snapshot.owner, operation: snapshot.operation });
      lastPublish = performance.now();
    };
    const viewportOptions = () => {
      const focused = document.activeElement;
      const group = root.contains(focused) ? focused.closest?.('[data-swarm-group]') : null;
      return { top, direction, pinned: new Set(group ? [group.dataset.swarmGroup] : []), reduced };
    };
    const classify = () => {
      if (dirty) {
        measureBlueprint(scheduler.snapshot().tasks);
        top = Math.max(0, ...[...root.querySelectorAll('[data-swarm-nav]')].map(nav => nav.getBoundingClientRect().bottom));
        top = Math.min(window.innerHeight, top);
        dirty = false;
      }
      return scheduler.updateViewport(window.innerHeight, viewportOptions());
    };
    const render = snapshot => scene?.render(snapshot, reduced, { top, paused: blocked() });
    const resize = new ResizeObserver(() => wake(true));
    const intersection = new IntersectionObserver(() => wake(true), { threshold: [0, 0.1, 1] });
    const observe = () => {
      resize.disconnect();
      intersection.disconnect();
      resize.observe(root);
      const groups = new Set(scheduler.snapshot().tasks.map(task => task.groupElement).filter(Boolean));
      groups.forEach(group => { resize.observe(group); intersection.observe(group); });
      root.querySelectorAll('[data-swarm-nav]').forEach(nav => resize.observe(nav));
    };
    const refresh = () => {
      tasks = collectBlueprint(root);
      scheduler.reconcile(tasks);
      scene?.track(tasks);
      observe();
      dirty = true;
      collect = false;
    };
    const advanceTour = snapshot => {
      if (!follow || reduced || blocked() || !snapshot.idle || snapshot.working) return false;
      const groups = snapshot.groups ?? [];
      groups.forEach(group => {
        if (group.state === 'visible' && group.geometry.y < window.innerHeight && group.geometry.y + group.geometry.height > top) tourOrder = Math.max(tourOrder, group.order);
      });
      const next = [...groups].sort((a, b) => a.order - b.order).find(group => group.order > tourOrder && ['queued', 'culled'].includes(group.state));
      if (!next) { follow = false; return false; }
      tourOrder = next.order;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      tourScroll = Math.max(0, Math.min(maxScroll, window.scrollY + next.geometry.y - top - 24));
      window.scrollTo({ top: tourScroll, behavior: 'instant' });
      dirty = true;
      return true;
    };
    function step(now) {
      frame = null;
      if (disposed) return;
      if (collect) refresh();
      let snapshot = scheduler.snapshot();
      if (!live) {
        snapshot = classify(); // Full exits are culled even while all animation is paused.
        if (anchorTarget) {
          const targetTask = snapshot.tasks.find(task => !task.structural && (task.element === anchorTarget || task.element.contains(anchorTarget)));
          const box = targetTask?.groupGeometry;
          if (!anchorTarget.isConnected) anchorTarget = null;
          else if (box && box.y < window.innerHeight && box.y + box.height > top) {
            snapshot = scheduler.completeIds(new Set([targetTask.id]));
            anchorTarget = null;
          }
        }
        const delta = lastTime === null ? 0 : Math.max(0, now - lastTime);
        snapshot = scheduler.tick(delta, window.innerHeight, speed, blocked(), viewportOptions());
        render(snapshot);
      }
      const touring = !live && advanceTour(snapshot);
      if (now - lastPublish >= 150 || !snapshot.working || blocked() || touring) publish(snapshot);
      if (!live && !blocked() && (snapshot.working || touring)) {
        lastTime = now;
        frame = requestAnimationFrame(step);
      } else lastTime = null;
    }
    function wake(geometry = false) {
      if (disposed) return;
      if (geometry) dirty = true;
      if (frame === null) frame = requestAnimationFrame(step);
    }
    const goLive = () => {
      if (live || disposed) return;
      scheduler.complete();
      live = true;
      follow = false;
      tourScroll = null;
      anchorTarget = null;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTime = null;
      scene?.restore();
      scene = null;
      root.dataset.swarmStage = 'live';
      liveCallbackRef.current?.(true);
      publish();
    };
    const reset = () => {
      scene?.restore();
      tasks = collectBlueprint(root);
      scheduler.reconcile(tasks);
      scheduler.reset();
      scene = createScene(root, tasks, count);
      live = false;
      userPaused = false;
      follow = false;
      tourOrder = -1;
      tourScroll = null;
      anchorTarget = null;
      collect = false;
      lastTime = null;
      root.dataset.swarmStage = 'rebuilding';
      liveCallbackRef.current?.(false);
      observe();
      wake(true);
    };
    const stopFollowing = () => {
      tourScroll = null;
      if (!follow) return;
      follow = false;
      wake();
    };
    const finishRegion = event => {
      if (live) return;
      stopFollowing();
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href^="#"]');
      if (event.type === 'click' && !anchor) return;
      let region = target;
      if (anchor) {
        const hash = anchor.getAttribute('href').slice(1);
        if (!hash) return;
        let id;
        try { id = decodeURIComponent(hash); } catch { return; }
        const destination = document.getElementById(id);
        if (!destination || !root.contains(destination)) return;
        region = destination.matches('h1, h2, h3, [data-swarm-group]') ? destination : destination.querySelector('h1, h2, h3') ?? destination;
        // A section anchor exposes its heading group, never every descendant card.
        if (region.matches('section')) region = region.querySelector('h1, h2, h3') ?? region;
        anchorTarget = region;
      } else if (target.closest('[data-swarm-nav], [data-swarm-preserve]')) { wake(true); return; }
      else anchorTarget = null;
      const current = scheduler.snapshot().tasks;
      const groupElement = region.closest('[data-swarm-group]');
      const targetTask = current.find(task => task.element === region) ?? current.find(task => !task.structural && task.element.contains(region));
      const groupId = targetTask?.groupId ?? groupElement?.dataset.swarmGroup;
      if (!groupId) { wake(true); return; }
      const ids = new Set(current.filter(task => task.groupId === groupId && !task.preserve && !task.structural).map(task => task.id));
      scheduler.completeIds(ids);
      dirty = true;
      render(classify());
      publish();
      wake();
    };
    const scroll = () => {
      const y = window.scrollY;
      if (y !== lastY) direction = y > lastY ? 1 : -1;
      lastY = y;
      if (tourScroll !== null && Math.abs(y - tourScroll) <= 2) tourScroll = null;
      else stopFollowing();
      wake(true);
    };
    const keyInput = event => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) stopFollowing();
    };
    const invalidate = () => wake(true);
    const contentChanged = () => { collect = true; wake(true); };
    const motionChanged = () => { reduced = media.matches; if (reduced) stopFollowing(); wake(true); };
    const mutation = new MutationObserver(records => {
      const annotated = '[data-swarm-kind][data-swarm-id]';
      const changed = records.some(record => record.type === 'attributes' || [...record.addedNodes, ...record.removedNodes].some(node => node instanceof Element && (node.matches(annotated) || node.querySelector(annotated))));
      if (changed) contentChanged();
    });
    mutation.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-swarm-id', 'data-swarm-kind', 'data-swarm-text', 'data-swarm-group', 'data-swarm-preserve', 'src'] });
    const controller = {
      goLive, reset, wake,
      refreshTasks: contentChanged,
      pause() { userPaused = !userPaused; lastTime = null; wake(true); },
      speed() { speed = speed % 3 + 1; wake(); },
      reduced() { reduced = !reduced; if (reduced) stopFollowing(); wake(true); },
      follow() { follow = !follow; tourOrder = -1; tourScroll = null; wake(true); },
    };
    controllerRef.current = controller;
    observe();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', invalidate);
    document.addEventListener('visibilitychange', invalidate);
    root.addEventListener('load', invalidate, true);
    root.addEventListener('focusin', finishRegion);
    root.addEventListener('focusout', invalidate);
    root.addEventListener('pointerdown', finishRegion);
    root.addEventListener('click', finishRegion);
    window.addEventListener('wheel', stopFollowing, { passive: true });
    window.addEventListener('touchstart', stopFollowing, { passive: true });
    window.addEventListener('keydown', keyInput);
    media.addEventListener('change', motionChanged);
    wake(true);
    document.fonts?.ready.then(() => { if (!disposed) contentChanged(); });

    return () => {
      disposed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      mutation.disconnect();
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', invalidate);
      document.removeEventListener('visibilitychange', invalidate);
      root.removeEventListener('load', invalidate, true);
      root.removeEventListener('focusin', finishRegion);
      root.removeEventListener('focusout', invalidate);
      root.removeEventListener('pointerdown', finishRegion);
      root.removeEventListener('click', finishRegion);
      window.removeEventListener('wheel', stopFollowing);
      window.removeEventListener('touchstart', stopFollowing);
      window.removeEventListener('keydown', keyInput);
      media.removeEventListener('change', motionChanged);
      scene?.restore();
      if (previousStage === undefined) delete root.dataset.swarmStage;
      else root.dataset.swarmStage = previousStage;
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [rootRef]);

  useEffect(() => { controllerRef.current?.refreshTasks(); }, [contentKey]);

  if (paused) return null;
  return <SwarmHud stats={stats} onPause={() => controllerRef.current?.pause()} onSpeed={() => controllerRef.current?.speed()} onReplay={() => controllerRef.current?.reset()} onLive={() => controllerRef.current?.goLive()} onStop={onStop} onReduced={() => controllerRef.current?.reduced()} onFollow={() => controllerRef.current?.follow()} />;
}

export default FullSwarm;
