export const BUILDERS = [
  { name: 'Nova', color: '#6ee7b7' },
  { name: 'Pixel', color: '#67e8f9' },
  { name: 'Atlas', color: '#c4b5fd' },
  { name: 'Echo', color: '#fbbf24' },
  { name: 'Sora', color: '#f9a8d4' },
  { name: 'Byte', color: '#93c5fd' },
];

const ERASE_DURATION = 240;
const EDGE_BAND = 120;

export function createScheduler(blueprint, builderCount = 6) {
  let tasks = [];
  let groups = new Map();
  let owner = null;
  let operation = null;
  let clock = 0;
  let bypass = false;
  let viewport = { height: 0, top: 64, direction: 1, pinned: new Set(), reduced: false };

  const resetTask = task => {
    task.state = 'culled';
    task.progress = 0;
    task.builder = null;
    task.eraseFrom = null;
  };
  const groupTasks = group => tasks.filter(task => !task.structural && task.groupId === group.id && !task.preserve);
  const releaseOwner = () => {
    tasks.forEach(task => { task.builder = null; });
    owner = null;
    operation = null;
  };
  const cull = group => {
    if (owner === group.id) releaseOwner();
    group.state = 'culled';
    groupTasks(group).forEach(resetTask);
  };
  const show = group => {
    if (owner === group.id) releaseOwner();
    group.state = 'visible';
    group.edgeLocked = false;
    groupTasks(group).forEach(task => { task.state = 'done'; task.progress = 1; task.builder = null; });
  };
  const position = group => {
    const box = group.geometry;
    const pixels = Math.max(0, Math.min(box.y + box.height, viewport.height) - Math.max(box.y, viewport.top));
    const inView = pixels > 0 && box.width > 0;
    const eligible = inView && pixels >= Math.min(96, box.height * 0.3);
    const edge = viewport.direction > 0
      ? box.y < viewport.top && box.y + box.height <= viewport.top + EDGE_BAND
      : box.y + box.height > viewport.height && box.y >= viewport.height - EDGE_BAND;
    const returning = viewport.direction > 0
      ? box.y + box.height > viewport.top + EDGE_BAND + 32
      : box.y < viewport.height - EDGE_BAND - 32;
    return { pixels, inView, eligible, edge, returning };
  };
  const selectOwner = () => {
    if (bypass || viewport.reduced) { releaseOwner(); return; }
    const outgoing = [...groups.values()].filter(group => group.state === 'erasing');
    outgoing.sort((a, b) => position(a).pixels - position(b).pixels || a.order - b.order);
    if (outgoing.length && owner !== outgoing[0].id) {
      if (owner && operation === 'build') {
        const interrupted = groups.get(owner);
        interrupted.state = 'queued';
        groupTasks(interrupted).forEach(task => { if (task.state === 'running') task.state = 'pending'; });
      }
      releaseOwner();
      owner = outgoing[0].id;
      operation = 'erase';
    }
    if (owner) return;
    const incoming = [...groups.values()].filter(group => group.state === 'queued' && position(group).eligible && !group.edgeLocked);
    incoming.sort((a, b) => (a.geometry.y - b.geometry.y) * viewport.direction || a.order - b.order);
    if (incoming.length) {
      owner = incoming[0].id;
      operation = 'build';
      incoming[0].state = 'building';
    }
  };
  const snapshot = () => ({
    tasks,
    groups: [...groups.values()],
    owner, operation, clock,
    completed: bypass,
    idle: owner === null,
    working: owner !== null && !bypass && !viewport.reduced,
    total: tasks.filter(task => !task.preserve).length,
    done: tasks.filter(task => !task.preserve && task.state === 'done').length,
    active: tasks.filter(task => task.builder !== null && ['running', 'erasing'].includes(task.state)),
  });

  const reconcile = next => {
    const previous = new Map(tasks.map(task => [task.id, task]));
    const previousGroups = groups;
    const changedGroups = new Set();
    tasks = next.map(task => {
      const existing = previous.get(task.id);
      const groupId = task.groupId ?? task.id;
      if (!existing && !task.structural && !task.preserve) changedGroups.add(groupId);
      return { ...task, groupId: task.groupId ?? task.id, groupGeometry: task.groupGeometry ?? task.geometry, state: existing?.state === 'running' ? 'pending' : existing?.state ?? 'culled', progress: existing?.progress ?? 0, builder: null, eraseFrom: existing?.eraseFrom ?? null };
    });
    groups = new Map();
    tasks.filter(task => !task.structural && !task.preserve).forEach(task => {
      if (!groups.has(task.groupId)) {
        const existing = previousGroups.get(task.groupId);
        groups.set(task.groupId, { id: task.groupId, state: existing?.state ?? 'culled', geometry: task.groupGeometry, order: task.index, edgeLocked: existing?.edgeLocked ?? false, eraseElapsed: existing?.eraseElapsed ?? 0 });
      }
    });
    if (owner && !groups.has(owner)) releaseOwner();
    changedGroups.forEach(id => {
      const group = groups.get(id);
        if (['visible', 'queued', 'building'].includes(group?.state)) {
          if (group.state === 'visible') group.state = 'queued';
          groupTasks(group).forEach(task => { if (task.state === 'culled') task.state = 'pending'; });
        }
    });
    if (bypass) groups.forEach(show);
  };

  const updateViewport = (height, options = {}) => {
    viewport = { ...viewport, ...options, height };
    const byId = new Map(tasks.map(task => [task.id, task]));
    groups.forEach(group => {
      const member = tasks.find(task => task.groupId === group.id);
      if (member) group.geometry = member.groupGeometry;
      const location = position(group);
      if (bypass || viewport.pinned.has(group.id)) { show(group); return; }
      if (!location.inView) {
        cull(group);
        group.edgeLocked = false;
        return;
      }
      if (viewport.reduced) { show(group); return; }
      if (group.state === 'erasing') {
        if (!location.edge) {
          if (owner === group.id) releaseOwner();
          group.state = 'queued';
          group.edgeLocked = false;
          groupTasks(group).forEach(task => { task.state = task.progress >= 1 ? 'done' : 'pending'; task.builder = null; });
        }
        return;
      }
      if (group.edgeLocked) {
        if (location.edge || !location.returning) return;
        group.edgeLocked = false;
      }
      if (location.edge && ['visible', 'building'].includes(group.state)) {
        if (owner === group.id) releaseOwner();
        group.state = 'erasing';
        group.eraseElapsed = 0;
        groupTasks(group).forEach(task => { task.eraseFrom = task.progress; task.state = task.progress > 0 ? 'erasing' : 'culled'; task.builder = null; });
      } else if (group.state === 'culled' && location.eligible) {
        group.state = 'queued';
        groupTasks(group).forEach(task => { task.state = 'pending'; });
      } else if (group.state === 'queued' && !location.eligible) {
        if (owner === group.id) releaseOwner();
      }
    });
    const requiredSurfaces = new Set();
    tasks.filter(task => !task.structural && (bypass || position(groups.get(task.groupId) ?? { geometry: task.geometry }).inView || viewport.pinned.has(task.groupId))).forEach(task => {
      let dependency = byId.get(task.dependency);
      const visited = new Set();
      while (dependency && !visited.has(dependency.id)) {
        visited.add(dependency.id);
        if (dependency.structural) requiredSurfaces.add(dependency.id);
        dependency = byId.get(dependency.dependency);
      }
    });
    tasks.filter(task => task.structural || task.preserve).forEach(task => {
      const ready = task.preserve || bypass || requiredSurfaces.has(task.id);
      task.state = ready ? 'done' : 'culled';
      task.progress = ready ? 1 : 0;
      task.builder = null;
    });
    selectOwner();
    return snapshot();
  };

  const completeIds = ids => {
    const groupIds = new Set(tasks.filter(task => ids.has(task.id)).map(task => task.groupId));
    groupIds.forEach(id => { const group = groups.get(id); if (group) show(group); });
    updateViewport(viewport.height);
    return snapshot();
  };
  const complete = () => {
    bypass = true;
    releaseOwner();
    groups.forEach(show);
    tasks.forEach(task => { task.state = 'done'; task.progress = 1; task.builder = null; });
    return snapshot();
  };
  const reset = () => {
    bypass = false;
    clock = 0;
    releaseOwner();
    tasks.forEach(resetTask);
    groups.forEach(group => { group.state = 'culled'; group.edgeLocked = false; });
    return updateViewport(viewport.height);
  };
  const tick = (delta, height, speed = 1, paused = false, options = {}) => {
    updateViewport(height, options);
    if (paused || !owner) return snapshot();
    const elapsed = Math.max(0, Math.min(delta, 250)) * speed;
    clock += elapsed;
    const group = groups.get(owner);
    const owned = groupTasks(group);
    if (operation === 'erase') {
      group.eraseElapsed += elapsed;
      owned.forEach((task, index) => {
        task.progress = (task.eraseFrom ?? task.progress) * Math.max(0, 1 - group.eraseElapsed / ERASE_DURATION);
        task.state = task.progress > 0 ? 'erasing' : 'culled';
        task.builder = task.progress > 0 && index < builderCount ? index : null;
      });
      if (group.eraseElapsed >= ERASE_DURATION) {
        cull(group);
        group.edgeLocked = true;
      }
    } else {
      owned.forEach(task => {
        if (task.state !== 'running') return;
        task.progress = Math.min(1, task.progress + elapsed / task.duration);
        if (task.progress >= 1) { task.state = 'done'; task.builder = null; }
      });
      const byId = new Map(tasks.map(task => [task.id, task]));
      const reserved = new Set(owned.filter(task => task.state === 'running').map(task => task.builder));
      const candidates = owned.filter(task => task.state === 'pending' && (!task.dependency || byId.get(task.dependency)?.state === 'done'));
      for (let builder = 0; builder < builderCount; builder += 1) {
        if (reserved.has(builder)) continue;
        const task = candidates.shift();
        if (!task) break;
        task.state = 'running';
        task.builder = builder;
      }
      if (owned.every(task => task.state === 'done')) { group.state = 'visible'; releaseOwner(); }
    }
    selectOwner();
    return snapshot();
  };

  reconcile(blueprint);
  return { tick, updateViewport, snapshot, complete, completeIds, reset, reconcile };
}
