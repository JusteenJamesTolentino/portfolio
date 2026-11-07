import { BUILDERS } from './scheduler';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const VECTOR_TAGS = new Set(['svg', 'g', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']);
const VECTOR_ATTRIBUTES = new Set(['viewBox', 'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'width', 'height', 'points', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'transform', 'fill-rule', 'clip-rule']);
const PRESERVED = '[data-swarm-nav], [data-swarm-preserve], input, textarea, select, [contenteditable]:not([contenteditable="false"])';
const TARGET = '[data-swarm-kind][data-swarm-id]';
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

function svgElement(name, attributes) {
  const element = document.createElementNS(SVG_NAMESPACE, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function createBuilder(builder) {
  const node = document.createElement('div');
  node.className = 'full-swarm-cursor';
  node.style.color = builder.color;
  const arrow = svgElement('svg', { viewBox: '0 0 20 24', width: '20', height: '24' });
  arrow.append(svgElement('path', { d: 'M2 2L3 20L8 15L12 22L16 20L12 13L19 12Z', fill: 'currentColor', stroke: '#07130f' }));
  const label = document.createElement('span');
  label.style.backgroundColor = builder.color;
  label.textContent = builder.name;
  const job = document.createElement('small');
  node.append(arrow, label, job);
  return { node, job };
}

// Reapply the blueprint allowlist rather than cloning live DOM or active SVG content.
function renderVector(vector) {
  if (!vector || !VECTOR_TAGS.has(vector.tag)) return null;
  const attributes = Object.fromEntries(Object.entries(vector.attributes ?? {}).filter(([key, value]) => VECTOR_ATTRIBUTES.has(key) && !/url\s*\(|(?:javascript|data):/i.test(String(value))));
  const node = svgElement(vector.tag, attributes);
  (vector.children ?? []).forEach(child => { const next = renderVector(child); if (next) node.append(next); });
  return node;
}

function createPresentation(task) {
  const node = document.createElement('div');
  node.className = `full-swarm-item full-swarm-${task.kind}`;
  Object.assign(node.style, task.style);
  node.style.boxSizing = 'border-box';
  if (task.kind === 'text') {
    node.style.padding = '0';
    node.style.background = 'none';
    node.style.border = '0';
    const content = document.createElement('span');
    const caret = document.createElement('span');
    caret.className = 'full-swarm-caret';
    node.append(content, caret);
    return { node, content, caret };
  }
  if (task.kind === 'surface') {
    node.style.padding = '0';
    node.style.border = '0';
    const outline = svgElement('svg', { viewBox: '0 0 100 100', preserveAspectRatio: 'none' });
    const rect = svgElement('rect', { x: '0.5', y: '0.5', width: '99', height: '99', rx: '2', pathLength: '100' });
    outline.classList.add('full-swarm-outline');
    outline.append(rect);
    node.append(outline);
    return { node, rect };
  }
  if (task.kind === 'image') {
    const image = task.vector ? renderVector(task.vector) : document.createElement('img');
    if (image) {
      if (!task.vector) {
        // Use only a declared image source, never form state or a cloned interactive element.
        if (task.imageSource && !/^\s*(?:javascript|data):/i.test(task.imageSource)) image.src = task.imageSource;
        image.alt = '';
        image.draggable = false;
      }
      Object.assign(image.style, { width: '100%', height: '100%', objectFit: task.style?.objectFit, objectPosition: task.style?.objectPosition, borderRadius: task.style?.borderRadius });
      node.style.padding = '0';
      node.append(image);
    }
  } else {
    node.style.display = 'grid';
    node.style.placeItems = 'center';
    node.textContent = task.publicText ?? '';
  }
  return { node };
}

export function createScene(root, tasks, builderCount) {
  const scene = document.createElement('div');
  scene.setAttribute('data-full-swarm-scene', '');
  scene.className = 'full-swarm-scene';
  scene.setAttribute('aria-hidden', 'true');
  scene.inert = true;
  const grid = document.createElement('div');
  grid.className = 'full-swarm-blueprint-grid';
  const items = document.createElement('div');
  items.className = 'full-swarm-items';
  const guides = svgElement('svg', { width: '100%', height: '100%' });
  guides.classList.add('full-swarm-guides');
  scene.append(grid, items, guides);
  const builders = BUILDERS.slice(0, builderCount).map(createBuilder);
  builders.forEach(builder => scene.append(builder.node));
  document.body.append(scene);
  const presentations = new Map();
  const originals = new Map();
  const groupOriginals = new Map();
  let disposed = false;

  const eligible = task => !task.preserve && task.element?.isConnected && !task.element.closest(PRESERVED);
  const restoreMask = element => {
    const original = originals.get(element);
    if (original === undefined) delete element.dataset.swarmMask;
    else element.dataset.swarmMask = original;
    originals.delete(element);
  };
  const remember = element => {
    if (!originals.has(element)) originals.set(element, element.dataset.swarmMask);
  };
  const hasProtectedChildren = element => Boolean(element.querySelector(`${TARGET}, ${PRESERVED}`));
  const track = nextTasks => {
    if (disposed) return;
    const next = nextTasks.filter(eligible);
    const elements = new Set(next.map(task => task.element));
    originals.forEach((_, element) => { if (!elements.has(element)) restoreMask(element); });
    next.forEach(task => { remember(task.element); });
    const groups = new Set(next.map(task => task.groupElement).filter(element => element && !element.closest(PRESERVED)));
    groupOriginals.forEach((original, element) => {
      if (groups.has(element)) return;
      if (original === undefined) delete element.dataset.swarmGroupState;
      else element.dataset.swarmGroupState = original;
      groupOriginals.delete(element);
    });
    groups.forEach(element => { if (!groupOriginals.has(element)) groupOriginals.set(element, element.dataset.swarmGroupState); });
    presentations.forEach((view, id) => {
      const task = next.find(item => item.id === id);
      if (!task || task.element !== view.element || task.publicText !== view.publicText || task.imageSource !== view.imageSource) {
        view.node.remove();
        presentations.delete(id);
      }
    });
  };
  track(tasks);

  const render = (snapshot, reduced = false, options = {}) => {
    if (disposed) return;
    if (snapshot.completed) {
      restore();
      return;
    }
    const top = clamp(options.top ?? 0, 0, window.innerHeight);
    const scrollY = options.scrollY ?? window.scrollY;
    scene.style.setProperty('--full-swarm-top', `${top}px`);
    scene.dataset.motion = reduced ? 'reduced' : 'full';
    scene.dataset.paused = options.paused ? 'true' : 'false';
    scene.dataset.operation = snapshot.operation ?? 'idle';
    const activeVisible = new Set();
    const activeBuilders = new Set();
    const guideLines = [];
    const groups = new Map((snapshot.groups ?? []).map(group => [group.id, group]));
    groupOriginals.forEach((_, element) => {
      const group = groups.get(element.dataset.swarmGroup);
      if (group) element.dataset.swarmGroupState = group.state === 'done' ? 'visible' : group.state === 'running' ? 'building' : group.state;
    });
    snapshot.tasks.forEach(task => {
      if (!eligible(task)) return;
      const element = task.element;
      const box = task.geometry;
      if (!box) return;
      const viewY = box.y - scrollY;
      const visible = viewY + box.height > top && viewY < window.innerHeight && box.x + box.width > 0 && box.x < window.innerWidth && box.width > 0 && box.height > 0;
      const protectedChildren = task.id !== 'hero-title' && task.kind !== 'surface' && hasProtectedChildren(element);
      const focused = element.contains(document.activeElement);
      const keepTitle = task.id === 'hero-title' && task.state === 'done' && visible && !focused;
      const hidden = task.state !== 'done' || keepTitle;
      // Surface masks affect only paint. Text/control ancestors never hide descendants.
      element.dataset.swarmMask = task.kind === 'surface' ? hidden ? 'surface' : 'done' : protectedChildren ? 'container' : hidden && !focused ? task.kind : 'done';
      const animating = task.state === 'running' || task.state === 'erasing';
      // Preserve React-owned parent text and descendants; animate only standalone targets.
      if ((!animating && !keepTitle) || !visible || focused || protectedChildren) return;
      activeVisible.add(task.id);
      let view = presentations.get(task.id);
      if (!view) {
        view = { ...createPresentation(task), element, publicText: task.publicText, imageSource: task.imageSource };
        presentations.set(task.id, view);
        items.append(view.node);
      }
      const progress = clamp(task.progress, 0, 1);
      Object.assign(view.node.style, { left: `${box.x}px`, top: `${viewY}px`, width: `${box.width}px`, height: `${box.height}px` });
      view.node.dataset.operation = task.state === 'erasing' ? 'erase' : 'build';
      const builder = builders[task.builder];
      const color = BUILDERS[task.builder]?.color ?? '#7b7ff7';
      view.node.style.setProperty('--builder-color', color);
      let cursorX = box.x;
      let cursorY = box.y;
      if (task.kind === 'text') {
        const text = task.publicText ?? '';
        const letters = Math.floor(text.length * progress);
        const displayed = text.slice(0, letters);
        if (view.content.textContent !== displayed) view.content.textContent = displayed;
        view.caret.style.display = animating && !reduced ? 'inline-block' : 'none';
        const textRect = view.content.getBoundingClientRect();
        cursorX = Math.min(box.x + box.width, textRect.right);
        cursorY = Math.min(viewY + box.height, textRect.bottom - scrollY);
      } else if (task.kind === 'surface') {
        view.rect.style.stroke = color;
        view.rect.style.strokeDasharray = '100';
        view.rect.style.strokeDashoffset = `${100 * (1 - progress)}`;
        view.node.style.opacity = `${progress}`;
        const perimeter = progress * 4;
        if (perimeter < 1) cursorX += box.width * perimeter;
        else if (perimeter < 2) { cursorX += box.width; cursorY += viewY + box.height * (perimeter - 1); }
        else if (perimeter < 3) { cursorX += box.width * (3 - perimeter); cursorY += viewY + box.height; }
        else cursorY += viewY + box.height * (4 - perimeter);
        guideLines.push({ x: box.x, y: viewY, color });
      } else {
        view.node.style.opacity = `${progress}`;
        view.node.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
        view.node.style.transform = reduced ? 'none' : `translate(${(1 - progress) * 16}px, ${(1 - progress) * 12}px)`;
        cursorX += box.width * progress;
        cursorY += viewY + box.height * 0.5;
      }
      // Both typing and erasing stay in the target's visible intersection below navigation.
      const left = Math.max(0, box.x);
      const right = Math.min(window.innerWidth, box.x + box.width);
      const upper = Math.max(top, viewY);
      const lower = Math.min(window.innerHeight, viewY + box.height);
      cursorX = clamp(cursorX, left, Math.max(left, right - 1));
      cursorY = clamp(cursorY, upper, Math.max(upper, lower - 1));
      if (builder && animating && !reduced && !options.paused) {
        activeBuilders.add(task.builder);
        builder.node.style.display = 'block';
        builder.node.dataset.operation = task.state === 'erasing' ? 'erase' : 'build';
        builder.node.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        builder.job.textContent = `${task.state === 'erasing' ? 'erasing' : task.kind === 'text' ? 'typing' : task.kind === 'surface' ? 'drawing' : 'placing'} / ${task.id}`;
      }
    });
    presentations.forEach((view, id) => {
      if (!activeVisible.has(id)) { view.node.remove(); presentations.delete(id); }
    });
    builders.forEach((builder, index) => { if (!activeBuilders.has(index)) builder.node.style.display = 'none'; });
    guides.replaceChildren();
    if (!reduced && !options.paused) guideLines.forEach(line => {
      const y = clamp(line.y, top, window.innerHeight);
      const x = clamp(line.x, 0, window.innerWidth);
      guides.append(svgElement('line', { x1: '0', x2: window.innerWidth, y1: y, y2: y, stroke: line.color, 'stroke-dasharray': '4 6', opacity: '.2' }));
      guides.append(svgElement('line', { x1: x, x2: x, y1: top, y2: window.innerHeight, stroke: line.color, 'stroke-dasharray': '4 6', opacity: '.2' }));
    });
  };
  function restore() {
    if (disposed) return;
    disposed = true;
    originals.forEach((_, element) => restoreMask(element));
    groupOriginals.forEach((original, element) => {
      if (original === undefined) delete element.dataset.swarmGroupState;
      else element.dataset.swarmGroupState = original;
    });
    groupOriginals.clear();
    presentations.clear();
    scene.remove();
  }
  return { render, track, restore };
}
