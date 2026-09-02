import { describe, expect, it } from 'vitest';
import { makeEngine, renderStyles, ruleList } from '../../../dev/engineHarness';

/**
 * C7: the logical twins of the physical side props, and the direction they answer to. The *axis* props
 * were already logical (`mx` is `margin-inline`), so what this adds is the two sides of that axis.
 */
describe('the logical side props', () => {
  it('write the inline-start and inline-end longhands', () => {
    const engine = makeEngine('logical-sides');

    renderStyles(engine, { ps: 4, pe: 2, ms: 'auto', me: 1, bs: 2, be: 1 });

    // Registry order rather than call order, which is the cascade rank the engine sorts by.
    expect(ruleList(engine)).toEqual([
      '.bs-2{border-inline-start-width:2px}',
      '.be-1{border-inline-end-width:1px}',
      '.ms-auto{margin-inline-start:auto}',
      '.me-1{margin-inline-end:0.25rem}',
      '.ps-4{padding-inline-start:1rem}',
      '.pe-2{padding-inline-end:0.5rem}',
    ]);
  });

  it('keeps the physical side a separate declaration, so the two can be mixed', () => {
    const engine = makeEngine('logical-physical');

    expect(renderStyles(engine, { pl: 4, ps: 4 })).toEqual(['_b', 'pl-4', 'ps-4']);
    expect(ruleList(engine)).toEqual(['.pl-4{padding-left:1rem}', '.ps-4{padding-inline-start:1rem}']);
  });

  it('takes the auto and the fractions its physical twin takes', () => {
    const engine = makeEngine('logical-inset');

    renderStyles(engine, { insetStart: '1/4', insetEnd: 'auto' });

    expect(ruleList(engine)).toEqual(['.insetStart-1\\/4{inset-inline-start:25%}', '.insetEnd-auto{inset-inline-end:auto}']);
  });
});

describe('the logical border radii', () => {
  it('round a whole inline side with one prop, and one corner with the other four', () => {
    const engine = makeEngine('logical-radius');

    renderStyles(engine, { borderRadiusStart: 2, borderRadiusStartEnd: 1 });

    expect(ruleList(engine)).toEqual([
      '.borderRadiusStart-2{border-start-start-radius:0.5rem;border-end-start-radius:0.5rem}',
      '.borderRadiusStartEnd-1{border-start-end-radius:0.25rem}',
    ]);
  });
});

/**
 * `rtl`/`ltr` are ordinary pseudo-class keys, so every composition another one gets comes with them.
 * The selector is `:dir()` rather than Tailwind's `[dir="rtl"] &`: direction is a property of the element
 * itself, which an ancestor selector cannot read off a `<bdi>` or a `dir="auto"` that flipped it.
 */
describe('the direction states', () => {
  it('put the direction on the element own compound selector', () => {
    const engine = makeEngine('direction-basics');

    const classNames = renderStyles(engine, { rtl: { ms: 0 }, ltr: { me: 0 } });

    expect(classNames).toEqual(['_b', 'rtl-ms-0', 'ltr-me-0']);
    expect(ruleList(engine)).toEqual(['.rtl-ms-0:dir(rtl){margin-inline-start:0rem}', '.ltr-me-0:dir(ltr){margin-inline-end:0rem}']);
  });

  it('compose with a breakpoint, a state and a negation like any other key', () => {
    const engine = makeEngine('direction-composed');

    renderStyles(engine, { md: { rtl: { hover: { textAlign: 'end' } } }, not: { rtl: { textAlign: 'start' } } });

    expect(ruleList(engine)).toEqual([
      '.not-rtl-textAlign-start:not(:dir(rtl)){text-align:start}',
      '@media (min-width: 768px){.md-hover-rtl-textAlign-end:hover:dir(rtl){text-align:end}}',
    ]);
  });

  it('styles an element from an ancestor direction too, since the state vocabulary is one list', () => {
    const engine = makeEngine('direction-group');

    renderStyles(engine, { group: { 'page/rtl': { textAlign: 'end' } } });

    expect(ruleList(engine)).toEqual(['.page:dir(rtl) .rtl-page-textAlign-end{text-align:end}']);
  });
});
