import { describe, expect, it } from 'vitest';
import { makeEngine, renderStyles, ruleList } from '../../../dev/engineHarness';

/**
 * `startingStyle` is the third kind of nesting: not a selector and not a media query, but a wrapper
 * around the finished rule — the values a property starts from the first time the element is styled.
 * Everything else nests *around* it, which is what keeps one entrance rule shareable by every Box asking
 * for the same one.
 */
describe('startingStyle', () => {
  it('wraps each prop in its own @starting-style block', () => {
    const engine = makeEngine('starting-style-basics');

    const classNames = renderStyles(engine, { opacity: 1, startingStyle: { opacity: 0 } });

    expect(classNames).toEqual(['_b', 'opacity-1', 'starting-opacity-0']);
    expect(ruleList(engine)).toEqual(['.opacity-1{opacity:1}', '@starting-style{.starting-opacity-0{opacity:0}}']);
  });

  it('keeps a starting value and the value it starts from in separate rules', () => {
    const engine = makeEngine('starting-style-same-prop');

    // Both classes are on the element: the entrance value is a different rule, not a different element.
    expect(renderStyles(engine, { opacity: 0, startingStyle: { opacity: 0 } })).toEqual(['_b', 'opacity-0', 'starting-opacity-0']);
    expect(ruleList(engine)).toEqual(['.opacity-0{opacity:0}', '@starting-style{.starting-opacity-0{opacity:0}}']);
  });

  it('shares one rule between every Box that starts from the same value', () => {
    const engine = makeEngine('starting-style-dedupe');

    renderStyles(engine, { startingStyle: { opacity: 0 }, bgColor: 'red-500' });
    renderStyles(engine, { startingStyle: { opacity: 0 }, bgColor: 'blue-500' });

    expect(ruleList(engine).filter((rule) => rule.includes('@starting-style'))).toEqual([
      '@starting-style{.starting-opacity-0{opacity:0}}',
    ]);
  });

  it('composes a transform the way any other rule does', () => {
    const engine = makeEngine('starting-style-transform');

    renderStyles(engine, { startingStyle: { translateY: 2, scale: 0.95 } });

    // The two translate axes write a custom property plus the composed declaration — a starting block
    // is ordinary declarations, so it inherits that and moves rather than jumping.
    expect(ruleList(engine)).toEqual([
      '@starting-style{.starting-scale-0\\.95{scale:0.95}}',
      '@starting-style{.starting-translateY-2{--boxTranslateY:0.5rem;translate:var(--boxTranslateX, 0) var(--boxTranslateY, 0)}}',
    ]);
  });

  it('nests inside a breakpoint, media query outermost', () => {
    const engine = makeEngine('starting-style-breakpoint');

    const classNames = renderStyles(engine, { md: { startingStyle: { opacity: 0 } } });

    expect(classNames).toEqual(['_b', 'md-starting-opacity-0']);
    expect(ruleList(engine)).toEqual(['@media (min-width: 768px){@starting-style{.md-starting-opacity-0{opacity:0}}}']);
  });

  it('nests inside a preference, so an entrance can be declared for reduced motion', () => {
    const engine = makeEngine('starting-style-preference');

    renderStyles(engine, { motionReduce: { startingStyle: { opacity: 1 } } });

    expect(ruleList(engine)).toEqual([
      '@media (prefers-reduced-motion: reduce){@starting-style{.motionReduce-starting-opacity-1{opacity:1}}}',
    ]);
  });

  it('nests inside a theme, keeping the ancestor selector', () => {
    const engine = makeEngine('starting-style-theme');

    renderStyles(engine, { theme: { dark: { startingStyle: { bgColor: 'gray-900' } } } });

    expect(ruleList(engine)).toEqual(['@starting-style{.dark .starting-theme-dark-bgColor-gray-900{background-color:var(--gray-900)}}']);
  });

  it('nests inside a pseudo-class', () => {
    const engine = makeEngine('starting-style-pseudo');

    renderStyles(engine, { hover: { startingStyle: { opacity: 0 } } });

    expect(ruleList(engine)).toEqual(['@starting-style{.starting-hover-opacity-0:hover{opacity:0}}']);
  });

  it('takes plain props only — a nested key inside it emits nothing', () => {
    const engine = makeEngine('starting-style-flat');

    // A rule can hold one media query and one selector, and both are already spoken for by the time the
    // block wraps it. Nesting the other way round (`md: { startingStyle: … }`) is the supported form.
    const classNames = renderStyles(engine, { startingStyle: { opacity: 0, md: { opacity: 0.5 }, hover: { opacity: 0.5 } } as never });

    expect(classNames).toEqual(['_b', 'starting-opacity-0']);
    expect(ruleList(engine)).toEqual(['@starting-style{.starting-opacity-0{opacity:0}}']);
  });

  /**
   * The one thing about `@starting-style` that no test in this repo can see for itself: Chrome computes
   * the before-change style from the whole cascade, so a starting declaration has to *win* against the
   * ordinary declaration of the same property. Landing before it means no transition at all — measured in
   * a browser, and the reason a starting rule sorts after every ordinary one rather than beside it.
   */
  describe('cascade position', () => {
    it('sorts after the ordinary rule for the same prop, whichever order the props arrive in', () => {
      const engine = makeEngine('starting-style-order');

      renderStyles(engine, { startingStyle: { opacity: 0 }, opacity: 1 });

      expect(ruleList(engine)).toEqual(['.opacity-1{opacity:1}', '@starting-style{.starting-opacity-0{opacity:0}}']);
    });

    it('sorts after a breakpoint and a preference too, so a base entrance still wins at every width', () => {
      const engine = makeEngine('starting-style-order-media');

      renderStyles(engine, { startingStyle: { opacity: 0 }, md: { opacity: 1 }, motionReduce: { opacity: 1 } });

      // Media rank orders the starting half exactly as it orders the ordinary one — after all of it.
      expect(ruleList(engine)).toEqual([
        '@media (min-width: 768px){.md-opacity-1{opacity:1}}',
        '@media (prefers-reduced-motion: reduce){.motionReduce-opacity-1{opacity:1}}',
        '@starting-style{.starting-opacity-0{opacity:0}}',
      ]);
    });

    it('takes a cascade layer after every ordinary one in element mode, where rule order is render order', () => {
      const engine = makeEngine('starting-style-layers', { sink: 'element' });

      const { styleElements } = engine.resolveClassNames({ opacity: 1, startingStyle: { opacity: 0 } }, false);

      const [normal, starting] = styleElements!.slice(-2).map((element) => element.css);
      const layerOf = (css: string) => css.slice('@layer '.length, css.indexOf('{'));
      const order = styleElements![0].css.slice('@layer '.length).split(',');

      expect(starting).toContain('{@starting-style{.starting-opacity-0{opacity:0}}}');
      expect(order.indexOf(layerOf(normal))).toBeLessThan(order.indexOf(layerOf(starting)));
    });
  });
});
