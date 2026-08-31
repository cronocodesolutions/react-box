/**
 * `@cronocode/react-box/core` — the styling engine, without React. Everything under `src/core` imports
 * no framework (CI enforces it), so a plain-DOM app, a Web Component or another framework can use it:
 *
 * ```js
 * import { createStyleEngine } from '@cronocode/react-box/core';
 *
 * const engine = createStyleEngine();
 * document.querySelector('#card').className = engine.classNames({ p: 4, bgColor: 'blue-500' });
 * ```
 *
 * That is the whole runtime: no build step, no provider, no effects. Rules reach the document on their
 * own microtask; `flushSync()` is for reading computed styles in the same tick and `getStyles()` for
 * static output. Each call here is a fresh instance — the React entries share one default engine so
 * `Box` and `Box.extend()` agree, while a vanilla app has no such ambient thing to agree with.
 */
export { classNames } from './core/classNames';
export type { ClassNameType } from './core/classNames';
export { createStyleEngine, DEFAULT_STYLE_ELEMENT_ID } from './core/engine/styleEngine';
export type { StyleEngine, StyleEngineOptions, StylesConfiguration } from './core/engine/styleEngine';
export { manualScheduler, microtaskScheduler, syncScheduler } from './core/engine/flushScheduler';
export type { KeyframeStop, KeyframeStops, Keyframes } from './core/engine/keyframes';
export type { FlushScheduler } from './core/engine/flushScheduler';
export type { SinkMode, SortedRule, StyleElementDescriptor, StyleSink } from './core/engine/styleSink';
export { default as createThemeController } from './core/theme/themeController';
export type { ThemeController, ThemeControllerOptions } from './core/theme/themeController';
export {
  applyThemeToElement,
  clearStoredTheme,
  defaultThemeName,
  documentRoot,
  getSystemTheme,
  readStoredTheme,
  setThemeAttribute,
  watchSystemTheme,
  writeStoredTheme,
} from './core/theme/themeRuntime';
export type { BoxComponentStyles, BoxStyleProps, BoxStyles } from './types';
