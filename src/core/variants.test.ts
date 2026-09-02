import { describe, expect, it } from 'vitest';
import Variants from './variants';

/**
 * The grammar behind the five variant keys. Everything here is a pure string → selector question, so it
 * is tested without an engine; what the engine does with the answer is `engine/variants.test.ts`.
 */
describe('Variants.variant', () => {
  it('reads a data attribute with and without a value', () => {
    expect(Variants.variant('dataAttr', 'state=open')).toEqual({ name: 'dataAttr-state=open', selector: '[data-state="open"]' });
    expect(Variants.variant('dataAttr', 'loading')).toEqual({ name: 'dataAttr-loading', selector: '[data-loading]' });
  });

  it('defaults a bare aria attribute to "true", the way the attribute itself does', () => {
    expect(Variants.variant('ariaAttr', 'selected')?.selector).toBe('[aria-selected="true"]');
    expect(Variants.variant('ariaAttr', 'sort=ascending')?.selector).toBe('[aria-sort="ascending"]');
  });

  it('puts the key inside :has() and the pseudo-class inside :not()', () => {
    expect(Variants.variant('has', ':checked')?.selector).toBe(':has(:checked)');
    expect(Variants.variant('has', 'img[alt]')?.selector).toBe(':has(img[alt])');
    expect(Variants.variant('not', 'hover')?.selector).toBe(':not(:hover)');
    // `disabled` and `selected` are attribute selectors rather than pseudo-classes — negated all the same.
    expect(Variants.variant('not', 'disabled')?.selector).toBe(':not([disabled])');
  });

  it('negates an attribute as readily as a pseudo-class: one state vocabulary', () => {
    expect(Variants.variant('not', 'data-loading')?.selector).toBe(':not([data-loading])');
    expect(Variants.variant('not', 'data-state=open')?.selector).toBe(':not([data-state="open"])');
    expect(Variants.variant('not', 'aria-selected')?.selector).toBe(':not([aria-selected="true"])');
  });

  it('counts a position among siblings, from either end', () => {
    expect(Variants.variant('nth', 'first')).toEqual({ name: 'nth-first', selector: ':first-child' });
    expect(Variants.variant('nth', 'last')?.selector).toBe(':last-child');
    expect(Variants.variant('nth', 'only')?.selector).toBe(':only-child');
    expect(Variants.variant('nth', 'odd')?.selector).toBe(':nth-child(odd)');
    expect(Variants.variant('nth', '3')?.selector).toBe(':nth-child(3)');
    expect(Variants.variant('nth', '2n+1')?.selector).toBe(':nth-child(2n+1)');
    expect(Variants.variant('nth', '-n+3')?.selector).toBe(':nth-child(-n+3)');
    // `last` in front counts from the end, which is the only thing `:nth-last-child()` is for.
    expect(Variants.variant('nth', 'last 2')?.selector).toBe(':nth-last-child(2)');
    expect(Variants.variant('nth', 'last even')?.selector).toBe(':nth-last-child(even)');
  });

  it('rejects a formula it would have to guess at', () => {
    // The whitespace CSS allows inside `An+B` is not offered: a class name holds the key as written.
    expect(Variants.variant('nth', '2n + 1')).toBeNull();
    expect(Variants.variant('nth', 'third')).toBeNull();
    expect(Variants.variant('nth', '2)')).toBeNull();
    expect(Variants.variant('nth', 'last')?.selector).not.toContain('nth');
  });

  it('names the variant key in the class-name segment', () => {
    // Without it `dataAttr={{ selected }}` and `ariaAttr={{ selected }}` — two different selectors —
    // would resolve to one class, and whichever rule was generated first would win for both.
    expect(Variants.variant('dataAttr', 'selected')?.name).toBe('dataAttr-selected');
    expect(Variants.variant('ariaAttr', 'selected')?.name).toBe('ariaAttr-selected');
  });

  it('rejects a key it cannot turn into a selector', () => {
    expect(Variants.variant('dataAttr', '')).toBeNull();
    expect(Variants.variant('dataAttr', 'bad name')).toBeNull();
    expect(Variants.variant('dataAttr', '1state')).toBeNull();
    // The value lands between double quotes, so a quote of its own would end it.
    expect(Variants.variant('dataAttr', 'state=a"b')).toBeNull();
    expect(Variants.variant('not', 'nonsense')).toBeNull();
    // `theme` is an ancestor class, and a pseudo-element cannot be negated.
    expect(Variants.variant('not', 'theme')).toBeNull();
    expect(Variants.variant('not', 'before')).toBeNull();
  });

  it('refuses a :has() selector that could close the rule it sits in', () => {
    expect(Variants.variant('has', 'a{color:red}')).toBeNull();
    expect(Variants.variant('has', 'a;b')).toBeNull();
    expect(Variants.variant('has', '/*')).toBeNull();
    // Unbalanced brackets would swallow the declaration block instead of failing as a selector.
    expect(Variants.variant('has', 'img[alt')).toBeNull();
    expect(Variants.variant('has', ':not(:checked')).toBeNull();
  });
});

describe('Variants.add', () => {
  it('keeps the list in one canonical order, whichever order the props were written in', () => {
    const data = Variants.variant('dataAttr', 'state=open')!;
    const not = Variants.variant('not', 'hover')!;

    // `.x[data-state="open"]:not(:hover)` and `.x:not(:hover)[data-state="open"]` match the same
    // elements, so the two orderings have to resolve to the same class rather than two of them.
    expect(Variants.add(Variants.add([], data), not)).toEqual(Variants.add(Variants.add([], not), data));
  });
});
