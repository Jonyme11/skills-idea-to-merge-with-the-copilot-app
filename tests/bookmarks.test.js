import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBookmark,
  normalizeUrl,
  parseBookmarks,
} from '../src/lib/bookmarks.js';

test('normalizes URLs with and without https to the same value', () => {
  assert.equal(normalizeUrl('https://www.example.com'), 'https://www.example.com');
  assert.equal(normalizeUrl('www.example.com'), 'https://www.example.com');
});

test('recovers from empty stored values', () => {
  assert.deepEqual(parseBookmarks(null), []);
  assert.deepEqual(parseBookmarks(''), []);
});

test('recovers from corrupted stored values', () => {
  assert.deepEqual(parseBookmarks('{not valid json'), []);
});

test('recovers from legacy and non-array stored values', () => {
  assert.deepEqual(parseBookmarks(JSON.stringify({ url: 'https://example.com' })), []);
  assert.deepEqual(parseBookmarks(JSON.stringify(['https://example.com'])), []);
});

test('drops malformed entries and keeps valid entries', () => {
  const raw = JSON.stringify([
    { url: 'https://example.com', slug: 'mona-7fk2' },
    { url: 42, slug: 'mona-42' },
    { url: 'https://bad.test', slug: 'bad-slug' },
  ]);
  assert.deepEqual(parseBookmarks(raw), [
    { url: 'https://example.com', slug: 'mona-7fk2' },
  ]);
});

test('formats a saved bookmark with the exact separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
