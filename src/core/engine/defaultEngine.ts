import { createStyleEngine, DEFAULT_STYLE_ELEMENT_ID, StyleEngine } from './styleEngine';

// The engine every public API talks to when no explicit instance is used. Created lazily so
// importing the library has no side effects, and pinned to the historical style-element id so
// existing markup, SSG output and docs keep working.
let defaultEngine: StyleEngine | undefined;

export default function getDefaultEngine(): StyleEngine {
  if (!defaultEngine) {
    defaultEngine = createStyleEngine({ styleElementId: DEFAULT_STYLE_ELEMENT_ID });
  }

  return defaultEngine;
}
