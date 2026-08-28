import { afterEach, describe, expect, it } from 'vitest';
import { documentHead, documentOrNull, documentRoot, hasDocument, isBrowser, matchMedia } from './environmentUtils';

describe('EnvironmentUtils (with a DOM)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('recognises a browser', () => {
    expect(isBrowser()).toBe(true);
    expect(hasDocument()).toBe(true);
  });

  it('hands back the document and the parts of it callers write to', () => {
    expect(documentOrNull()).toBe(document);
    expect(documentRoot()).toBe(document.documentElement);
    expect(documentHead()).toBe(document.head);
  });

  it('answers a media query', () => {
    expect(matchMedia('(prefers-color-scheme: dark)')).not.toBeNull();
  });

  /**
   * jsdom shipped without `matchMedia` for years and embedded webviews still do, so "there is a
   * window" is not the same question as "the preference can be read" — the theme runtime relies on
   * the difference to fall back to light instead of throwing.
   */
  it('answers null for a media query where matchMedia does not exist', () => {
    const original = window.matchMedia;

    try {
      // @ts-expect-error — deleting a DOM API to stand in for an environment that lacks it.
      delete window.matchMedia;

      expect(matchMedia('(prefers-color-scheme: dark)')).toBeNull();
    } finally {
      window.matchMedia = original;
    }
  });
});
