import { describe, expect, it } from 'vitest';
import ObjectUtils from './objectUtils';

/**
 * `mergeDeep` is what puts a component's default styles under the props a caller passes, so what it does
 * with an absent prop decides whether a conditional style prop can erase a component's own block.
 */
describe('ObjectUtils.mergeDeep', () => {
  it('keeps what it is merging into when the value is undefined', () => {
    // `hoverGroup={cond ? {…} : undefined}` — the shape every component here uses — used to delete the
    // component style's own `hoverGroup` whenever the condition was false (bug #61).
    const merged = ObjectUtils.mergeDeep({ hoverGroup: { resizer: { bgColor: 'gray-600' } }, p: 4 }, { hoverGroup: undefined, p: 2 });

    expect(merged).toEqual({ hoverGroup: { resizer: { bgColor: 'gray-600' } }, p: 2 });
  });

  it('still lets `clean` drop a component block on purpose', () => {
    const merged = ObjectUtils.mergeDeep({ hover: { bgColor: 'gray-600', color: 'white' } }, { hover: { clean: true, color: 'black' } });

    expect(merged).toEqual({ hover: { clean: true, color: 'black' } });
  });

  it('merges the blocks both sides declare', () => {
    const merged = ObjectUtils.mergeDeep({ hover: { bgColor: 'gray-600', color: 'white' } }, { hover: { color: 'black' } });

    expect(merged).toEqual({ hover: { bgColor: 'gray-600', color: 'black' } });
  });
});
