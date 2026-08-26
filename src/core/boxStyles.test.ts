import { describe, expect, it } from 'vitest';
import { generatedRulesOf, makeEngine, renderStyles } from '../../dev/engineHarness';
import { BoxStyleProps } from '../types';
import { cssStyles } from './boxStyles';
import { BoxStyle } from './coreTypes';

/**
 * The numeric formatters are the library's most common source of surprise: three different
 * dividers are in play and nothing but these tests pins them down. Each family below states the
 * divider once and then holds every prop that belongs to it, so a prop that silently changes
 * family (or a new prop added to the wrong one) fails here.
 */
const spacingDivider4 = [
  ['p', 'padding'],
  ['px', 'padding-inline'],
  ['py', 'padding-block'],
  ['pt', 'padding-top'],
  ['pr', 'padding-right'],
  ['pb', 'padding-bottom'],
  ['pl', 'padding-left'],
  ['m', 'margin'],
  ['mx', 'margin-inline'],
  ['my', 'margin-block'],
  ['mt', 'margin-top'],
  ['mr', 'margin-right'],
  ['mb', 'margin-bottom'],
  ['ml', 'margin-left'],
  ['gap', 'gap'],
  ['rowGap', 'row-gap'],
  ['columnGap', 'column-gap'],
  ['top', 'top'],
  ['right', 'right'],
  ['bottom', 'bottom'],
  ['left', 'left'],
  ['inset', 'inset'],
  ['width', 'width'],
  ['minWidth', 'min-width'],
  ['maxWidth', 'max-width'],
  ['height', 'height'],
  ['minHeight', 'min-height'],
  ['maxHeight', 'max-height'],
  ['borderRadius', 'border-radius'],
] as const;

const pixelDirect = [
  ['b', 'border-width'],
  ['bx', 'border-inline-width'],
  ['by', 'border-block-width'],
  ['bt', 'border-top-width'],
  ['br', 'border-right-width'],
  ['bb', 'border-bottom-width'],
  ['bl', 'border-left-width'],
  ['lineHeight', 'line-height'],
  ['letterSpacing', 'letter-spacing'],
  ['outline', 'outline-width'],
  ['outlineOffset', 'outline-offset'],
] as const;

const unitlessNumber = [
  ['flexGrow', 'flex-grow'],
  ['flexShrink', 'flex-shrink'],
  ['order', 'order'],
  ['gridColumnStart', 'grid-column-start'],
  ['gridColumnEnd', 'grid-column-end'],
  ['gridRowStart', 'grid-row-start'],
  ['gridRowEnd', 'grid-row-end'],
] as const;

function generatedRulesFor(props: BoxStyleProps, engineId: string) {
  const engine = makeEngine(engineId);
  renderStyles(engine, props);

  return generatedRulesOf(engine);
}

describe('numeric dividers', () => {
  describe('spacing scale — divider 4, so 4 is 1rem', () => {
    it.each(spacingDivider4)('%s emits %s divided by 4', (prop, styleName) => {
      expect(generatedRulesFor({ [prop]: 4 }, `divider4-${prop}`)).toContain(`{${styleName}:1rem}`);
      expect(generatedRulesFor({ [prop]: 2 }, `divider4-half-${prop}`)).toContain(`{${styleName}:0.5rem}`);
    });
  });

  describe('direct pixels — the number is the pixel count', () => {
    it.each(pixelDirect)('%s emits %s in px', (prop, styleName) => {
      expect(generatedRulesFor({ [prop]: 1 }, `px-${prop}`)).toContain(`{${styleName}:1px}`);
      expect(generatedRulesFor({ [prop]: 24 }, `px-24-${prop}`)).toContain(`{${styleName}:24px}`);
    });
  });

  describe('unitless numbers — passed through as declared', () => {
    it.each(unitlessNumber)('%s emits %s unitless', (prop, styleName) => {
      expect(generatedRulesFor({ [prop]: 2 }, `raw-${prop}`)).toContain(`{${styleName}:2}`);
    });

    it('keeps fontWeight unitless', () => {
      expect(generatedRulesFor({ fontWeight: 600 }, 'raw-fontWeight')).toContain('{font-weight:600}');
    });
  });

  describe('fontSize — divider 16, so the number is roughly the pixel size', () => {
    it('divides by 16 rather than by the spacing divider', () => {
      expect(generatedRulesFor({ fontSize: 16 }, 'fontSize-16')).toContain('{font-size:1rem}');
      expect(generatedRulesFor({ fontSize: 14 }, 'fontSize-14')).toContain('{font-size:0.875rem}');
      expect(generatedRulesFor({ fontSize: 4 }, 'fontSize-4')).toContain('{font-size:0.25rem}');
    });
  });

  describe('borderRadius belongs to the spacing scale, not to the pixel family', () => {
    // Called out on its own because it is the prop the docs have historically got wrong.
    it.each([
      ['borderRadius', 'border-radius'],
      ['borderRadiusTopLeft', 'border-top-left-radius'],
    ])('%s divides by 4', (prop, styleName) => {
      expect(generatedRulesFor({ [prop]: 8 }, `radius-${prop}`)).toContain(`{${styleName}:2rem}`);
    });
  });

  describe('fraction and keyword sizes', () => {
    it('converts fraction tokens to percentages', () => {
      expect(generatedRulesFor({ width: '1/2' }, 'frac-width')).toContain('{width:50%}');
      expect(generatedRulesFor({ p: '1/3' }, 'frac-p')).toContain(`{padding:${(1 / 3) * 100}%}`);
    });

    it('accepts negative fractions on the inset props', () => {
      // Only the inset and translate props declare the negative fraction scale; the spacing props
      // take negative numbers instead. See the roadmap bug ledger for that asymmetry.
      expect(generatedRulesFor({ top: '-1/4' }, 'frac-top')).toContain('{top:-25%}');
      expect(generatedRulesFor({ translateX: '-1/2' }, 'frac-translate')).toContain('{transform:translateX(-50%)}');
      expect(generatedRulesFor({ mt: -4 }, 'neg-mt')).toContain('{margin-top:-1rem}');
    });

    it('maps the size keywords', () => {
      expect(generatedRulesFor({ width: 'fit' }, 'kw-width-fit')).toContain('{width:100%}');
      expect(generatedRulesFor({ width: 'fit-screen' }, 'kw-width-screen')).toContain('{width:100vw}');
      expect(generatedRulesFor({ height: 'fit-screen' }, 'kw-height-screen')).toContain('{height:100vh}');
    });

    it('accepts a raw percentage string', () => {
      expect(generatedRulesFor({ width: '33%' }, 'pct-width')).toContain('{width:33%}');
    });
  });
});

/**
 * Every value a prop declares must reach CSS. A definition whose `values` no longer match what
 * `generateRule` looks for produces no rule at all — silently, until something renders it. This
 * walks the whole registry so that failure mode cannot survive a test run.
 */
function sampleFor(def: BoxStyle): { value: unknown; label: string } | undefined {
  const values = def.values as unknown;

  if (typeof values === 'number') return { value: 4, label: 'number' };
  if (typeof values === 'string') return { value: '50%', label: 'percent string' };

  if (Array.isArray(values)) {
    if (values.length === 0) return undefined;

    if (Array.isArray(values[0])) {
      const tuple = (values as unknown[][]).map((allowed) => allowed[0]);

      return { value: tuple, label: `tuple ${tuple.join('_')}` };
    }

    return { value: values[0], label: `${values[0]}` };
  }

  return undefined;
}

const definitions = Object.entries(cssStyles).flatMap(([prop, defs]) =>
  (defs as BoxStyle[]).map((def, index) => ({
    prop,
    index,
    sample: sampleFor(def),
    styleNames: Array.isArray(def.styleName) ? def.styleName : [def.styleName ?? prop],
  })),
);

describe('every declared prop value produces a rule', () => {
  it('covers the whole registry', () => {
    expect(Object.keys(cssStyles).length).toBeGreaterThan(100);
    expect(definitions.length).toBeGreaterThan(Object.keys(cssStyles).length);
  });

  it('declares at least one value definition for every prop', () => {
    expect(Object.entries(cssStyles).filter(([, defs]) => (defs as BoxStyle[]).length === 0)).toEqual([]);
  });

  it('produces a usable sample value for every definition', () => {
    expect(definitions.filter((d) => !d.sample).map((d) => `${d.prop}[${d.index}]`)).toEqual([]);
  });

  it.each(definitions.filter((d) => d.sample).map((d) => [`${d.prop}[${d.index}] = ${d.sample?.label}`, d] as const))(
    '%s',
    (_name, { prop, index, sample, styleNames }) => {
      const engine = makeEngine(`registry-${prop}-${index}`);
      const value = sample?.value;
      const classNames = renderStyles(engine, { [prop]: value } as BoxStyleProps);
      const rules = generatedRulesOf(engine);

      // A class name is only emitted when a rule backs it, so both halves must be present.
      expect(classNames).toContain(`${prop}-${Array.isArray(value) ? value.join('_') : value}`);
      for (const styleName of styleNames) {
        expect(rules).toContain(`${styleName}:`);
      }
    },
  );
});
