// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { documentHead, documentOrNull, documentRoot, hasDocument, isBrowser, matchMedia } from './environmentUtils';

/**
 * The half these helpers exist for: a process with no DOM at all, which is what a Node server
 * renders in. Every answer here has to be a value the caller can carry on with — `false` or
 * `null` — rather than a `ReferenceError` on a global that was never defined.
 */
describe('EnvironmentUtils (no DOM)', () => {
  it('knows it is not in a browser', () => {
    expect(isBrowser()).toBe(false);
    expect(hasDocument()).toBe(false);
  });

  it('answers null rather than throwing on the missing globals', () => {
    expect(documentOrNull()).toBeNull();
    expect(documentRoot()).toBeNull();
    expect(documentHead()).toBeNull();
    expect(matchMedia('(prefers-color-scheme: dark)')).toBeNull();
  });
});
