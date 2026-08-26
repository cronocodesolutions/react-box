/**
 * Where a style engine's CSS ends up. `flush()` decides *what* to write and in which order;
 * a sink decides *how* it is written — into a live stylesheet, into the text of a `<style>`
 * element, or into a string for server rendering.
 *
 * Every implementation must produce the same rule order for the same sequence of calls: a
 * generated rule sits at the position its `sortKey` gives it, whichever flush it arrived in, so
 * an app rendered on the server gets the same cascade the browser builds.
 */

/** A generated rule plus the sort key that fixes its position in the cascade. */
export interface SortedRule {
  sortKey: number;
  rule: string;
}

export type SinkMode = 'cssom' | 'textContent' | 'string';

export interface StyleSink {
  /** Which implementation this is. */
  readonly mode: SinkMode;
  /** The engine's base rules (reset + the first `:root` block), written once when it initializes. */
  writeBase(rules: readonly string[]): void;
  /** A `:root` block for variables first used after initialization. Goes ahead of everything else. */
  writeVariables(rule: string): void;
  /** Generated rules, each placed by its sort key. */
  writeRules(rules: readonly SortedRule[]): void;
  /** Everything written so far, as CSS text. */
  getStyles(): string;
  /** Drop everything written so far. */
  reset(): void;
}

/** First index whose key is strictly greater than `key` — so equal keys keep insertion order. */
function upperBound(keys: readonly number[], key: number): number {
  let lo = 0;
  let hi = keys.length;

  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (key < keys[mid]) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }

  return lo;
}

/**
 * The ordered rule model the string and textContent sinks share. It mirrors what the CSSOM sink
 * does to a real stylesheet: base rules first, late `:root` blocks pushed in front of them
 * (`insertRule(rule, 0)`), generated rules kept sorted by their sort key.
 */
function createRuleBuffer() {
  let variableRules: string[] = [];
  let baseRules: string[] = [];
  let rules: string[] = [];
  let sortKeys: number[] = [];

  return {
    writeBase(next: readonly string[]) {
      baseRules = [...baseRules, ...next];
    },
    writeVariables(rule: string) {
      variableRules = [rule, ...variableRules];
    },
    writeRules(batch: readonly SortedRule[]) {
      for (const { sortKey, rule } of batch) {
        const index = upperBound(sortKeys, sortKey);
        sortKeys.splice(index, 0, sortKey);
        rules.splice(index, 0, rule);
      }
    },
    getStyles() {
      // Base rules stay newline-separated and generated rules are concatenated, the way the
      // engine has always written them — the output is what SSR ships and tests read.
      return [...variableRules, ...baseRules].join('\n') + rules.join('');
    },
    reset() {
      variableRules = [];
      baseRules = [];
      rules = [];
      sortKeys = [];
    },
  };
}

/** Collects CSS in memory. The server-rendering sink, and the fallback wherever there is no DOM. */
export function createStringSink(): StyleSink {
  return { mode: 'string', ...createRuleBuffer() };
}

/** Writes the whole rule model into the style element's text on every change. */
export function createTextContentSink(getElement: () => HTMLStyleElement): StyleSink {
  const buffer = createRuleBuffer();

  function write() {
    getElement().textContent = buffer.getStyles();
  }

  return {
    mode: 'textContent',
    writeBase(rules) {
      buffer.writeBase(rules);
      write();
    },
    writeVariables(rule) {
      buffer.writeVariables(rule);
      write();
    },
    writeRules(rules) {
      buffer.writeRules(rules);
      write();
    },
    getStyles: buffer.getStyles,
    reset() {
      buffer.reset();
      write();
    },
  };
}

/** Inserts into the element's live `CSSStyleSheet` — what a browser uses. */
export function createCssomSink(getElement: () => HTMLStyleElement): StyleSink {
  // Number of base rules at the front of the sheet; generated rules are inserted after them.
  let baseRulesCount = 0;
  // Sort keys of the generated rules already in the sheet, ascending — the index of a key here is
  // the index of its rule in the sheet (offset by baseRulesCount).
  let sortKeys: number[] = [];

  // Re-resolved per write: the element can be recreated (or first gain a sheet) between flushes.
  function sheetOf(): CSSStyleSheet | null {
    return (getElement().sheet as CSSStyleSheet | null) ?? null;
  }

  return {
    mode: 'cssom',
    writeBase(rules) {
      const sheet = sheetOf();
      if (!sheet) return;

      for (const rule of rules) {
        try {
          sheet.insertRule(rule, baseRulesCount);
          baseRulesCount++;
        } catch {
          // Skip invalid rules.
        }
      }
    },
    writeVariables(rule) {
      const sheet = sheetOf();
      if (!sheet) return;

      try {
        sheet.insertRule(rule, 0);
        baseRulesCount++;
      } catch {
        // Skip if invalid.
      }
    },
    writeRules(rules) {
      const sheet = sheetOf();
      if (!sheet) return;

      for (const { sortKey, rule } of rules) {
        const index = upperBound(sortKeys, sortKey);

        try {
          sheet.insertRule(rule, baseRulesCount + index);
          sortKeys.splice(index, 0, sortKey);
        } catch {
          try {
            // Fallback: append. Wrapped as well, so one rule the parser rejects cannot abort the
            // whole flush and take every rule after it down with it.
            sheet.insertRule(rule, sheet.cssRules.length);
            sortKeys.push(sortKey);
          } catch {
            // Nothing to record — the rule never made it into the sheet.
          }
        }
      }
    },
    getStyles() {
      const sheet = sheetOf();

      return sheet ? [...sheet.cssRules].map((rule) => rule.cssText).join('\n') : '';
    },
    reset() {
      const sheet = sheetOf();
      baseRulesCount = 0;
      sortKeys = [];
      if (!sheet) return;

      while (sheet.cssRules.length > 0) {
        sheet.deleteRule(0);
      }
    },
  };
}

function canUseDom(): boolean {
  return typeof document !== 'undefined' && !!document.head;
}

/** The engine's `<style>` element, created (at the top of `<head>`) the first time it is needed. */
export function resolveStyleElement(styleElementId: string): HTMLStyleElement {
  let element = document.getElementById(styleElementId) as HTMLStyleElement | null;

  if (!element) {
    element = document.createElement('style');
    element.setAttribute('id', styleElementId);
    element.setAttribute('type', 'text/css');
    document.head.insertBefore(element, document.head.firstChild);
  }

  return element;
}

/**
 * Build the sink for a mode. With no mode given the sink follows the environment: a stylesheet in
 * the browser, a string on the server — which is why server rendering needs no fake `document`.
 */
export function createSink(styleElementId: string, mode?: SinkMode): StyleSink {
  if (mode === 'string' || !canUseDom()) return createStringSink();

  const getElement = () => resolveStyleElement(styleElementId);

  if (mode === 'textContent') return createTextContentSink(getElement);

  // A style element only has a `sheet` once it is in a document; without one (some test DOMs,
  // a detached element) rule text is the only way to write.
  return getElement().sheet ? createCssomSink(getElement) : createTextContentSink(getElement);
}
