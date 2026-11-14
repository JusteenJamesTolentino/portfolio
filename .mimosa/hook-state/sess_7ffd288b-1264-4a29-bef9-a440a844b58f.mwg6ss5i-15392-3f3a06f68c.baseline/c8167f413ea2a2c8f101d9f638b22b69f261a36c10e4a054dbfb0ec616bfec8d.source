const INTERNAL_PATHS = new Set(['/serialmonitor', '/serialmonitor/messenger']);
function hasControlCharacters(value) {
  return Array.from(value).some(character => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });
}

function looksLikeBareHost(value) {
  return /^[a-z0-9.-]+(?::\d+)?(?:\/.*)?$/i.test(value) && value.includes('.');
}

export function parseBrowserUrl(input) {
  if (typeof input !== 'string') return { ok: false, error: 'Enter a valid web address.' };
  const value = input.trim();
  if (!value) return { ok: false, error: 'Enter a web address.' };
  if (hasControlCharacters(value)) return { ok: false, error: 'The address contains invalid characters.' };

  let candidate = value;
  if (looksLikeBareHost(candidate)) candidate = `https://${candidate}`;
  else if (candidate.startsWith('/')) candidate = new URL(candidate, window.location.origin).href;

  let url;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, error: 'Enter a complete web address.' };
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, error: 'Only HTTP and HTTPS addresses are supported.' };
  }
  if (url.username || url.password) {
    return { ok: false, error: 'Addresses containing usernames or passwords are not allowed.' };
  }

  const internal = url.origin === window.location.origin;
  if (internal) {
    if (!INTERNAL_PATHS.has(url.pathname)) {
      return { ok: false, error: 'That portfolio route cannot be opened inside Browser.' };
    }
    url.searchParams.set('embed', 'os-browser');
  } else if (url.protocol !== 'https:') {
    return { ok: false, error: 'External sites must use HTTPS.' };
  }

  url.hash = '';
  return {
    ok: true,
    kind: internal ? 'internal' : 'external',
    url: url.href,
    displayUrl: internal ? `${url.pathname}${url.search}` : url.href,
    hostname: url.hostname,
  };
}
