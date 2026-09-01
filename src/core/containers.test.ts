import { describe, expect, it } from 'vitest';
import Containers from './containers';

/** The `cq` key grammar: a size, its complement, and the container name that lands in an at-rule prelude. */
describe('Containers.query', () => {
  it('compiles a size against the nearest container', () => {
    expect(Containers.query('md')).toEqual({ key: 'cq-md', rankKey: 'cq-md', prelude: '@container (min-width: 28rem)' });
  });

  it('compiles a max key as the complement of its size', () => {
    expect(Containers.query('maxXxl')).toEqual({ key: 'cq-maxXxl', rankKey: 'cq-maxXxl', prelude: '@container not (min-width: 42rem)' });
  });

  it('names a container, and ranks it by its size rather than its name', () => {
    expect(Containers.query('sidebar/lg')).toEqual({
      key: 'cq-sidebar/lg',
      rankKey: 'cq-lg',
      prelude: '@container sidebar (min-width: 32rem)',
    });
  });

  it('rejects a size it does not have, and a name that is not a custom-ident', () => {
    expect(Containers.query('huge')).toBeNull();
    expect(Containers.query('')).toBeNull();
    expect(Containers.query('my sidebar/md')).toBeNull();
    expect(Containers.query('side)bar/md')).toBeNull();
    // A word the prelude itself uses would compile to a query nobody wrote.
    expect(Containers.query('not/md')).toBeNull();
    // The size half is what a slash separates, so a name alone is not a query.
    expect(Containers.query('sidebar')).toBeNull();
  });

  it('takes a container name only where CSS would', () => {
    expect(Containers.isContainerName('sidebar')).toBe(true);
    expect(Containers.isContainerName('_card-2')).toBe(true);
    expect(Containers.isContainerName('2cards')).toBe(false);
    expect(Containers.isContainerName('none')).toBe(false);
    expect(Containers.isContainerName(4)).toBe(false);
  });

  it('ranks every size ascending and every max descending', () => {
    expect(Containers.rankKeys).toEqual([
      'cq-xs',
      'cq-sm',
      'cq-md',
      'cq-lg',
      'cq-xl',
      'cq-xxl',
      'cq-maxXxl',
      'cq-maxXl',
      'cq-maxLg',
      'cq-maxMd',
      'cq-maxSm',
      'cq-maxXs',
    ]);
  });
});
