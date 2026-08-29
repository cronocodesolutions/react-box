import { describe, expect, it } from 'vitest';
import { generatedRulesOf, makeEngine, renderStyles } from '../../../dev/engineHarness';
import { BoxStyleProps } from '../../types';

/**
 * How a nested pseudo prop becomes a compound selector — specifically, where the pseudo-*element*
 * ends up in it.
 *
 * `::before`, `::after` and `::placeholder` are elements, not classes, and CSS requires one to be
 * the last thing in a compound selector. A combination used to be assembled in the order the keys
 * are declared in `pseudoClasses`, which puts `before` in the middle of that list: `hover` is
 * declared first, so `hover: { before: … }` came out as `:hover::before` and worked, while
 * `checked: { before: … }` came out as `::before:checked` — invalid, and a browser drops the whole
 * rule rather than the offending half of the selector. A silent failure with nothing to see: the
 * element carries the class name, the rule is in the stylesheet, and nothing happens.
 *
 * The `switch` component style is what found it. Its thumb travels on
 * `checked: { before: { translateX: 4 } }`, and did not move.
 *
 * Note the two shapes below. At the top level of Box props a `pseudo2` key (`checked`, `disabled`,
 * `indeterminate`, `required`, `selected`) is `boolean | [state, styles]`, because it is a state as
 * well as a selector — so styles for it ride in the tuple's second slot. A component style, which
 * is where this was found, nests them as a plain object. Both reach the engine as the same nesting.
 */
describe('pseudo-element ordering in a compound selector', () => {
  it('puts ::before last when it is nested inside a pseudo-class declared before it', () => {
    const engine = makeEngine('pseudo-checked-before');

    renderStyles(engine, { checked: [false, { before: { translateX: 4 } }] });

    expect(generatedRulesOf(engine)).toContain(':checked::before{transform:translateX(1rem)}');
  });

  it('does the same for a component style, where the nesting is a plain object', () => {
    const engine = makeEngine('pseudo-component-shape');

    // The shape `Box.components({ switch: { styles: { checked: { before: … } } } })` produces.
    renderStyles(engine, { checked: { before: { translateX: 4 } } } as unknown as BoxStyleProps);

    expect(generatedRulesOf(engine)).toContain(':checked::before{transform:translateX(1rem)}');
  });

  it('leaves the order alone when the pseudo-class is already declared first', () => {
    const engine = makeEngine('pseudo-hover-before');

    renderStyles(engine, { hover: { before: { translateX: 2 } } });

    expect(generatedRulesOf(engine)).toContain(':hover::before{transform:translateX(0.5rem)}');
  });

  it.each([
    ['checked', ':checked::before'],
    ['indeterminate', ':indeterminate::before'],
    ['required', ':required::before'],
    ['disabled', '[disabled]::before'],
    ['selected', '[aria-selected="true"]::before'],
  ])('orders ::before after :%s, every one of which is declared after the element', (key, expected) => {
    const engine = makeEngine(`pseudo-order-${key}`);

    renderStyles(engine, { [key]: [false, { before: { opacity: 0.5 } }] } as BoxStyleProps);

    expect(generatedRulesOf(engine)).toContain(`${expected}{opacity:0.5}`);
  });

  it('does the same for ::after and ::placeholder', () => {
    const engine = makeEngine('pseudo-after-placeholder');

    renderStyles(engine, {
      disabled: [false, { after: { opacity: 0.5 } }],
      invalid: { placeholderStyles: { color: 'red-500' } },
    });

    const rules = generatedRulesOf(engine);

    expect(rules).toContain('[disabled]::after{opacity:0.5}');
    expect(rules).toContain(':user-invalid::placeholder{color:var(--red-500)}');
  });

  it('keeps every pseudo-class in the selector, in their declared order, with the element after them', () => {
    const engine = makeEngine('pseudo-many');

    renderStyles(engine, { hover: { checked: { before: { opacity: 0.5 } } } });

    expect(generatedRulesOf(engine)).toContain(':hover:checked::before{opacity:0.5}');
  });

  it('orders a themed nesting the same way — the theme is an ancestor, the element still last', () => {
    const engine = makeEngine('pseudo-theme');

    renderStyles(engine, { theme: { dark: { checked: { before: { opacity: 0.5 } } } } });

    const rules = generatedRulesOf(engine);

    expect(rules).toContain(':checked::before{opacity:0.5}');
    expect(rules).not.toContain('::before:checked');
  });

  it('never emits a pseudo-element anywhere but the end', () => {
    const engine = makeEngine('pseudo-none-mid');

    renderStyles(engine, {
      checked: [false, { before: { translateX: 4 } }],
      disabled: [false, { after: { opacity: 0.5 } }],
      hover: { before: { opacity: 0.5 } },
    });

    // A pseudo-element followed by anything but the start of the declaration block is the shape
    // that gets a rule thrown away, whatever the rest of the selector happens to be.
    expect(generatedRulesOf(engine)).not.toMatch(/::(before|after|placeholder)[^{,\s]/);
  });
});
