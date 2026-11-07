export const VIEW_SESSION_KEY = 'justeendev:view-mode:v1';

export function getViewPreference() {
  try {
    const value = sessionStorage.getItem(VIEW_SESSION_KEY);
    return value === 'web' || value === 'os' || value === 'game' ? value : null;
  } catch {
    return null;
  }
}

export function setViewPreference(value) {
  if (value !== 'web' && value !== 'os' && value !== 'game') return;
  try {
    sessionStorage.setItem(VIEW_SESSION_KEY, value);
  } catch {
    // The selected route still works if session storage is unavailable.
  }
}

export function clearViewPreference() {
  try {
    sessionStorage.removeItem(VIEW_SESSION_KEY);
  } catch {
    // The chooser can still be opened without clearing storage.
  }
}
