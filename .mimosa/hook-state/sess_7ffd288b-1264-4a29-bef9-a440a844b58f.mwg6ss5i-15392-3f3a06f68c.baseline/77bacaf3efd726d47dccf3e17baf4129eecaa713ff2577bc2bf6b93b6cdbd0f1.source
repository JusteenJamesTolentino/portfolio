import { useCallback, useReducer } from 'react';
import { OS_APPS } from '../config/osApps';

const TASKBAR_HEIGHT = 56;
const MARGIN = 20;

function createRect(app, index, viewport) {
  const workWidth = viewport.width;
  const workHeight = viewport.height - TASKBAR_HEIGHT;
  const width = Math.min(app.size.width, workWidth - MARGIN * 2);
  const height = Math.min(app.size.height, workHeight - MARGIN * 2);
  const offset = index * 28;
  return {
    x: Math.min(70 + offset, Math.max(MARGIN, workWidth - width - MARGIN)),
    y: Math.min(42 + offset, Math.max(MARGIN, workHeight - height - MARGIN)),
    width,
    height,
  };
}

function initialState(viewport) {
  const windows = Object.fromEntries(OS_APPS.map((app, index) => [
    app.id,
    {
      open: app.id === 'about',
      minimized: false,
      maximized: false,
      rect: createRect(app, index, viewport),
      restoreRect: null,
      zIndex: index + 10,
    },
  ]));
  return { windows, activeId: 'about', nextZ: OS_APPS.length + 11 };
}

function highestVisible(windows, exceptId) {
  return Object.entries(windows)
    .filter(([id, window]) => id !== exceptId && window.open && !window.minimized)
    .sort(([, a], [, b]) => b.zIndex - a.zIndex)[0]?.[0] ?? null;
}

function reducer(state, action) {
  const current = state.windows[action.id];
  switch (action.type) {
    case 'OPEN':
    case 'FOCUS':
      return {
        ...state,
        activeId: action.id,
        nextZ: state.nextZ + 1,
        windows: {
          ...state.windows,
          [action.id]: { ...current, open: true, minimized: false, zIndex: state.nextZ },
        },
      };
    case 'CLOSE':
      return {
        ...state,
        activeId: state.activeId === action.id ? highestVisible(state.windows, action.id) : state.activeId,
        windows: { ...state.windows, [action.id]: { ...current, open: false, minimized: false, maximized: false } },
      };
    case 'MINIMIZE':
      return {
        ...state,
        activeId: state.activeId === action.id ? highestVisible(state.windows, action.id) : state.activeId,
        windows: { ...state.windows, [action.id]: { ...current, minimized: true } },
      };
    case 'TOGGLE_MAXIMIZE':
      return {
        ...state,
        activeId: action.id,
        nextZ: state.nextZ + 1,
        windows: {
          ...state.windows,
          [action.id]: current.maximized
            ? { ...current, maximized: false, rect: current.restoreRect ?? current.rect, restoreRect: null, zIndex: state.nextZ }
            : { ...current, maximized: true, restoreRect: current.rect, zIndex: state.nextZ },
        },
      };
    case 'MOVE':
      return {
        ...state,
        windows: { ...state.windows, [action.id]: { ...current, rect: { ...current.rect, x: action.x, y: action.y } } },
      };
    case 'RESET':
      return initialState(action.viewport);
    default:
      return state;
  }
}

function getViewport() {
  return { width: window.innerWidth, height: window.innerHeight };
}

function useWindowManager() {
  const [state, dispatch] = useReducer(reducer, null, () => initialState(getViewport()));

  const openWindow = useCallback(id => dispatch({ type: 'OPEN', id }), []);
  const focusWindow = useCallback(id => dispatch({ type: 'FOCUS', id }), []);
  const closeWindow = useCallback(id => dispatch({ type: 'CLOSE', id }), []);
  const minimizeWindow = useCallback(id => dispatch({ type: 'MINIMIZE', id }), []);
  const toggleMaximize = useCallback(id => dispatch({ type: 'TOGGLE_MAXIMIZE', id }), []);
  const moveWindow = useCallback((id, x, y) => dispatch({ type: 'MOVE', id, x, y }), []);
  const resetLayout = useCallback(() => dispatch({ type: 'RESET', viewport: getViewport() }), []);

  return { state, openWindow, focusWindow, closeWindow, minimizeWindow, toggleMaximize, moveWindow, resetLayout };
}

export default useWindowManager;
