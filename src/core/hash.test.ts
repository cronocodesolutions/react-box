import { describe, expect, it } from 'vitest';
import { stableHash } from './hash';

describe('stableHash', () => {
  it('is a function of the text alone', () => {
    expect(stableHash('.p-4{padding:1rem}')).toBe(stableHash('.p-4{padding:1rem}'));
    expect(stableHash('.p-4{padding:1rem}')).not.toBe(stableHash('.p-8{padding:2rem}'));
  });

  it('produces something usable inside a class name and an href', () => {
    expect(stableHash('hover-p-4')).toMatch(/^[0-9a-z]+$/);
  });

  it('separates names that differ only at the end', () => {
    const names = new Set(Array.from({ length: 500 }, (_, index) => stableHash(`p-${index}`)));

    expect(names.size).toBe(500);
  });
});
