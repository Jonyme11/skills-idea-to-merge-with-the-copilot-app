export const STORAGE_KEY = 'mona-bookmarks';
export const COUNTER_KEY = 'mona-bookmark-counter';

export function normalizeUrl(input) {
  if (typeof input !== 'string') return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  let candidate = trimmed;
  if (!/^([a-z][a-z0-9+.-]*):\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (!url.hostname) return null;

    if (url.pathname === '/' && !url.search && !url.hash) {
      return url.origin;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function encodeBase62(value) {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let number = Math.max(0, Math.floor(Number(value) || 0));
  if (number === 0) return '0';

  let result = '';
  while (number > 0) {
    result = alphabet[number % 62] + result;
    number = Math.floor(number / 62);
  }
  return result;
}

export function nextSlug(counter) {
  return `mona-${encodeBase62(counter)}`;
}

export function parseBookmarks(rawValue) {
  if (typeof rawValue !== 'string' || !rawValue.trim()) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((entry) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false;
      if (typeof entry.url !== 'string' || typeof entry.slug !== 'string') return false;
      return /^mona-[0-9A-Za-z]+$/.test(entry.slug);
    }).map((entry) => ({
      url: normalizeUrl(entry.url) || entry.url,
      slug: entry.slug,
    })).filter((entry) => normalizeUrl(entry.url) !== null);
  } catch {
    return [];
  }
}

export function formatBookmark(bookmark) {
  if (!bookmark || typeof bookmark.url !== 'string' || typeof bookmark.slug !== 'string') {
    return '';
  }
  return `${bookmark.url} :: ${bookmark.slug}`;
}
