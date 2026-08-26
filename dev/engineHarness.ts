import { HTMLStyleElement } from 'happy-dom';
import { createStyleEngine, StyleEngine } from '../src/core/engine/styleEngine';
import { BoxStyleProps } from '../src/types';

/**
 * Shared helpers for engine-level tests. Engines are created with readable class names and the
 * `textContent` sink so a test can assert on the exact rule text, and with an explicit style
 * element id so each test owns its own `<style>` element inside the shared happy-dom document.
 */

/** The last rule the engine writes when it initializes — everything after it is generated CSS. */
export const LAST_BASE_RULE = '._s path,._s circle,._s rect,._s line {transition: all var(--svgTransitionTime);}';

export function makeEngine(styleElementId: string): StyleEngine {
  return createStyleEngine({ classNames: 'readable', sink: 'textContent', styleElementId });
}

/** Everything in the engine's style element, base rules included. */
export function rulesOf(engine: StyleEngine): string {
  const element = document.getElementById(engine.styleElementId) as unknown as HTMLStyleElement | null;

  return element?.innerText ?? '';
}

/** Only the rules generated from props — the base reset and `:root` blocks are dropped. */
export function generatedRulesIn(css: string): string {
  const index = css.indexOf(LAST_BASE_RULE);

  return index === -1 ? css : css.slice(index + LAST_BASE_RULE.length);
}

/** Only the rules generated from props, read out of the engine's style element. */
export function generatedRulesOf(engine: StyleEngine): string {
  return generatedRulesIn(rulesOf(engine));
}

/** Resolve a Box's class names and flush, the way a render would. */
export function renderStyles(engine: StyleEngine, props: BoxStyleProps, isSvg = false): string[] {
  const { classNames } = engine.resolveClassNames(props, isSvg);
  engine.flush();

  return classNames;
}

/** The generated rules of a CSS string as a list, e.g. `['.p-4{padding:1rem}']`. Media queries stay intact. */
export function ruleListIn(css: string): string[] {
  const rules: string[] = [];
  let depth = 0;
  let current = '';

  for (const char of generatedRulesIn(css)) {
    current += char;

    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) {
        // Base rules are newline-separated, generated ones are not: drop a separator that came
        // along with the rule so callers can compare rule text directly.
        rules.push(current.trim());
        current = '';
      }
    }
  }

  return rules;
}

/** The generated rules in the engine's style element, as a list. */
export function ruleList(engine: StyleEngine): string[] {
  return ruleListIn(rulesOf(engine));
}
