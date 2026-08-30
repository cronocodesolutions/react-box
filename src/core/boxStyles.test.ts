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
  // The prop count is quoted in the README, CLAUDE.md, CONTRIBUTING.md, ARTICLE.md, the npm
  // description, BOX_AI_CONTEXT.md, both skill files and two places on the docs site. Every one of
  // those was written by hand and none of them was ever checked, so the figure drifted to '~144'
  // against a registry of 117 (bug #71). Adding a prop now fails here until they are updated.
  const PROP_COUNT = 138;

  it('holds exactly the number of props the docs claim', () => {
    expect(Object.keys(cssStyles).length).toBe(PROP_COUNT);
    expect(definitions.length).toBeGreaterThan(PROP_COUNT);
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

/**
 * The SVG paint and stroke tier. Two things make it worth its own block: the numbers are user
 * units rather than any of the three dividers above, and `vectorEffect` is the one prop in the
 * registry that rewrites its own selector.
 */
describe('SVG paint and stroke props', () => {
  it.each([
    ['fill', 'red-500', 'fill:var(--red-500)'],
    ['stroke', 'blue-600', 'stroke:var(--blue-600)'],
    ['fillOpacity', 0.5, 'fill-opacity:0.5'],
    ['strokeOpacity', 0.8, 'stroke-opacity:0.8'],
    ['fillRule', 'evenodd', 'fill-rule:evenodd'],
    ['strokeLinecap', 'round', 'stroke-linecap:round'],
    ['strokeLinejoin', 'bevel', 'stroke-linejoin:bevel'],
    ['paintOrder', 'stroke', 'paint-order:stroke'],
    ['shapeRendering', 'crispEdges', 'shape-rendering:crispEdges'],
  ] as const)('%s emits %s', (prop, value, declaration) => {
    expect(generatedRulesFor({ [prop]: value }, `svg-${prop}`)).toContain(`{${declaration}}`);
  });

  describe('lengths are SVG user units — no divider, no unit', () => {
    it.each([
      ['strokeWidth', 'stroke-width'],
      ['strokeMiterlimit', 'stroke-miterlimit'],
      ['strokeDasharray', 'stroke-dasharray'],
      ['strokeDashoffset', 'stroke-dashoffset'],
    ] as const)('%s passes the number through', (prop, styleName) => {
      expect(generatedRulesFor({ [prop]: 2 }, `svg-unit-${prop}`)).toContain(`{${styleName}:2}`);
      expect(generatedRulesFor({ [prop]: 1.5 }, `svg-unit-half-${prop}`)).toContain(`{${styleName}:1.5}`);
    });

    it('takes a percentage of the path length for the dash offset', () => {
      expect(generatedRulesFor({ strokeDashoffset: '40%' }, 'svg-dashoffset-pct')).toContain('{stroke-dashoffset:40%}');
    });
  });

  describe('a dash pattern is a number or a string', () => {
    it('reads a single number as the dash and the gap alike', () => {
      expect(generatedRulesFor({ strokeDasharray: 8 }, 'svg-dash-number')).toContain('{stroke-dasharray:8}');
    });

    // A space in a value used to split the readable class name in two, so the class attribute held
    // neither of the names the rule was written for and the dashes never appeared.
    it('keeps a multi-length pattern in one class name', () => {
      const engine = makeEngine('svg-dash-pattern');
      const classNames = renderStyles(engine, { strokeDasharray: '8 4' });

      expect(classNames).toContain('strokeDasharray-8_4');
      expect(classNames.every((name) => !name.includes(' '))).toBe(true);
      expect(generatedRulesOf(engine)).toContain('.strokeDasharray-8_4{stroke-dasharray:8 4}');
    });
  });

  describe('vectorEffect reaches the shapes inside the element', () => {
    // vector-effect is the only SVG paint property that is not inherited, so a value on an <svg>
    // would otherwise style nothing at all.
    it('targets the element and its descendants', () => {
      const engine = makeEngine('svg-vector-effect');
      const classNames = renderStyles(engine, { vectorEffect: 'non-scaling-stroke' }, true);

      expect(classNames).toContain('vectorEffect-non-scaling-stroke');
      expect(generatedRulesOf(engine)).toContain(
        '.vectorEffect-non-scaling-stroke,.vectorEffect-non-scaling-stroke *{vector-effect:non-scaling-stroke}',
      );
    });

    it('keeps both halves of the selector under a pseudo-class', () => {
      expect(generatedRulesFor({ hover: { vectorEffect: 'non-scaling-stroke' } }, 'svg-vector-effect-hover')).toContain(
        '.hover-vectorEffect-non-scaling-stroke:hover,.hover-vectorEffect-non-scaling-stroke:hover *{vector-effect:non-scaling-stroke}',
      );
    });

    it('keeps both halves of the selector under a theme', () => {
      expect(generatedRulesFor({ theme: { dark: { vectorEffect: 'none' } } }, 'svg-vector-effect-theme')).toContain(
        '.dark .theme-dark-vectorEffect-none,.dark .theme-dark-vectorEffect-none *{vector-effect:none}',
      );
    });
  });

  it('nests under a theme, a pseudo-class and a breakpoint like any other prop', () => {
    expect(generatedRulesFor({ theme: { dark: { fill: 'slate-100' } } }, 'svg-theme')).toContain(
      '.dark .theme-dark-fill-slate-100{fill:var(--slate-100)}',
    );
    expect(generatedRulesFor({ hover: { stroke: 'red-500' } }, 'svg-hover')).toContain(
      '.hover-stroke-red-500:hover{stroke:var(--red-500)}',
    );
    expect(generatedRulesFor({ md: { strokeWidth: 3 } }, 'svg-breakpoint')).toContain('.md-strokeWidth-3{stroke-width:3}');
  });
});

/**
 * The SVG text and geometry tier. The geometry props are the reason it exists: `cx`, `cy`, `r`,
 * `rx`, `ry`, `x` and `y` are real CSS properties in SVG 2, so a shape can be transitioned with
 * no JavaScript at all — but only if the numbers stay in the user units the `viewBox` sets up,
 * which is the one thing three of the four numeric families here would break.
 */
describe('SVG text and geometry props', () => {
  describe('geometry lengths are user units — no divider, no unit', () => {
    it.each([['cx'], ['cy'], ['r'], ['rx'], ['ry'], ['x'], ['y']] as const)('%s passes the number through', (prop) => {
      expect(generatedRulesFor({ [prop]: 12 }, `svg-geom-${prop}`)).toContain(`{${prop}:12}`);
      expect(generatedRulesFor({ [prop]: 0.5 }, `svg-geom-half-${prop}`)).toContain(`{${prop}:0.5}`);
    });

    it.each([['cx'], ['cy'], ['r'], ['rx'], ['ry'], ['x'], ['y']] as const)('%s takes a percentage of the viewport', (prop) => {
      expect(generatedRulesFor({ [prop]: '50%' }, `svg-geom-pct-${prop}`)).toContain(`{${prop}:50%}`);
    });

    // A rect can sit left of or above its viewBox origin, so the geometry props are the only
    // numeric family besides the inset props that has to survive a minus sign in a class name.
    it.each([['x'], ['y'], ['cx'], ['cy']] as const)('%s accepts a negative position', (prop) => {
      const engine = makeEngine(`svg-geom-neg-${prop}`);
      const classNames = renderStyles(engine, { [prop]: -8 });

      expect(classNames).toContain(`${prop}--8`);
      expect(generatedRulesOf(engine)).toContain(`.${prop}--8{${prop}:-8}`);
    });

    it('lets a rect corner radius follow the other axis', () => {
      expect(generatedRulesFor({ rx: 'auto' }, 'svg-rx-auto')).toContain('{rx:auto}');
      expect(generatedRulesFor({ ry: 'auto' }, 'svg-ry-auto')).toContain('{ry:auto}');
    });

    // borderRadius is on the spacing scale (÷4) and rx is not. They read alike and mean different
    // numbers, which is exactly the confusion the user-units rule exists to prevent.
    it('does not share the spacing scale with borderRadius', () => {
      expect(generatedRulesFor({ borderRadius: 8, rx: 8 }, 'svg-rx-vs-radius')).toContain('{rx:8}');
      expect(generatedRulesFor({ borderRadius: 8, rx: 8 }, 'svg-rx-vs-radius2')).toContain('{border-radius:2rem}');
    });
  });

  it('anchors text against the position its element declares', () => {
    expect(generatedRulesFor({ textAnchor: 'middle' }, 'svg-text-anchor')).toContain('{text-anchor:middle}');
    expect(generatedRulesFor({ textAnchor: 'end' }, 'svg-text-anchor-end')).toContain('{text-anchor:end}');
  });

  describe('dominantBaseline reaches the text inside the element', () => {
    // dominant-baseline is the second SVG property CSS does not inherit (vectorEffect is the
    // other), so a value on an <svg> would otherwise style nothing at all.
    it('targets the element and its descendants', () => {
      const engine = makeEngine('svg-dominant-baseline');
      const classNames = renderStyles(engine, { dominantBaseline: 'central' }, true);

      expect(classNames).toContain('dominantBaseline-central');
      expect(generatedRulesOf(engine)).toContain('.dominantBaseline-central,.dominantBaseline-central *{dominant-baseline:central}');
    });

    it('keeps both halves of the selector under a pseudo-class and a theme', () => {
      expect(generatedRulesFor({ hover: { dominantBaseline: 'hanging' } }, 'svg-baseline-hover')).toContain(
        '.hover-dominantBaseline-hanging:hover,.hover-dominantBaseline-hanging:hover *{dominant-baseline:hanging}',
      );
      expect(generatedRulesFor({ theme: { dark: { dominantBaseline: 'middle' } } }, 'svg-baseline-theme')).toContain(
        '.dark .theme-dark-dominantBaseline-middle,.dark .theme-dark-dominantBaseline-middle *{dominant-baseline:middle}',
      );
    });
  });

  it('moves geometry under a pseudo-class, which is the whole zero-JS animation', () => {
    expect(generatedRulesFor({ r: 20, hover: { r: 28 } }, 'svg-grow')).toContain('.hover-r-28:hover{r:28}');
    expect(generatedRulesFor({ md: { cx: 40 } }, 'svg-geom-breakpoint')).toContain('.md-cx-40{cx:40}');
  });
});
