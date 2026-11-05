const MAX_TASKS = 600;
const TYPOGRAPHY = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textAlign', 'textTransform', 'whiteSpace', 'wordBreak', 'overflowWrap'];

export function collectBlueprint(root) {
  const stage = root.dataset.swarmStage;
  delete root.dataset.swarmStage;
  try {
    return captureTargets(root);
  } finally {
    if (stage !== undefined) root.dataset.swarmStage = stage;
  }
}

const VECTOR_TAGS = new Set(['svg', 'g', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']);
const VECTOR_ATTRIBUTES = new Set(['viewBox', 'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'width', 'height', 'points', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'transform', 'fill-rule', 'clip-rule']);

function captureVector(element) {
  if (!VECTOR_TAGS.has(element.localName)) return null;
  const attributes = Object.fromEntries([...element.attributes].filter(attribute => VECTOR_ATTRIBUTES.has(attribute.name) && !/url\s*\(/i.test(attribute.value)).map(attribute => [attribute.name, attribute.value]));
  return { tag: element.localName, attributes, children: [...element.children].map(captureVector).filter(Boolean) };
}

function captureTargets(root) {
  const targets = [...root.querySelectorAll('[data-swarm-kind][data-swarm-id]')].filter(element => (
    !element.matches('input, textarea, select') && !element.closest('[data-swarm-nav], [data-swarm-preserve]')
  ));
  const byElement = new Map(targets.map(element => [element, element.dataset.swarmId]));
  const tasks = [];
  const seen = new Set();
  targets.slice(0, MAX_TASKS).forEach((element, index) => {
    const id = element.dataset.swarmId;
    if (seen.has(id)) return;
    seen.add(id);
    const kind = element.dataset.swarmKind;
    if (!['surface', 'text', 'image', 'control'].includes(kind)) return;
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const style = getComputedStyle(element);
    let ancestor = element.parentElement;
    let dependency = null;
    while (ancestor && ancestor !== root) {
      if (ancestor.dataset.swarmKind === 'surface' && byElement.has(ancestor)) {
        dependency = byElement.get(ancestor);
        break;
      }
      ancestor = ancestor.parentElement;
    }
    const typography = Object.fromEntries(TYPOGRAPHY.map(name => [name, style[name]]));
    const publicText = element.dataset.swarmText ?? '';
    const imageSource = kind === 'image' && element.tagName === 'IMG' ? element.getAttribute('src') : null;
    const vector = kind === 'image' && element.localName === 'svg' ? captureVector(element) : null;
    const preserve = Boolean(element.closest('[data-swarm-nav], [data-swarm-preserve]'));
    const groupElement = element.closest('[data-swarm-group]');
    const groupId = groupElement?.dataset.swarmGroup ?? id;
    const structural = !groupElement && kind === 'surface';
    const groupRect = (groupElement ?? element).getBoundingClientRect();
    const groupGeometry = { x: groupRect.left, y: groupRect.top, width: groupRect.width, height: groupRect.height };
    const geometry = { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    tasks.push({
      id, kind, element, dependency, index, publicText, imageSource, vector, preserve, geometry,
      groupId, groupElement: groupElement ?? element, groupGeometry, structural,
      duration: (kind === 'text' ? Math.min(1550, Math.max(420, publicText.length * 10)) : kind === 'surface' ? 650 : 480) / 2,
      style: {
        ...typography,
        color: style.color,
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        borderColor: style.borderTopColor,
        borderWidth: style.borderTopWidth,
        borderStyle: style.borderTopStyle,
        borderRadius: style.borderRadius,
        padding: style.padding,
        boxSizing: style.boxSizing,
        objectFit: style.objectFit,
        objectPosition: style.objectPosition,
      },
    });
  });
  const ids = new Set(tasks.map(task => task.id));
  return tasks.map(task => ({ ...task, dependency: ids.has(task.dependency) ? task.dependency : null }));
}

export function measureBlueprint(tasks) {
  tasks.forEach(task => {
    if (!task.element.isConnected) return;
    const rect = task.element.getBoundingClientRect();
    task.geometry = { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    const groupRect = task.groupElement.getBoundingClientRect();
    task.groupGeometry = { x: groupRect.left, y: groupRect.top, width: groupRect.width, height: groupRect.height };
  });
}
