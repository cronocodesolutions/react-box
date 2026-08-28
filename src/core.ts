/**
 * `@cronocode/react-box/core` — the styling engine, without React.
 *
 * Everything the library does to turn props into CSS lives under `src/core`, which imports no
 * framework (CI enforces it: `npm run check:boundaries`). This entry is that engine as a public
 * package surface, so a plain-DOM app, a Web Component, or an adapter for another framework can
 * use it directly:
 *
 * ```js
 * import { createStyleEngine } from '@cronocode/react-box/core';
 *
 * const engine = createStyleEngine();
 *
 * document.querySelector('#card').className = engine.classNames({
 *   p: 4,
 *   bgColor: 'blue-500',
 *   borderRadius: 2,
 *   hover: { bgColor: 'blue-600' },
 *   md: { p: 8 },
 * });
 * ```
 *
 * That is the whole runtime: no build step, no provider, no effects to wire up. Rules reach the
 * document on their own microtask, so nothing has to be flushed by hand — `flushSync()` exists for
 * the case where computed styles are read in the same tick, and `getStyles()` for static output.
 *
 * The engine here is always a fresh instance. The React entries share one lazily-created default
 * engine so `Box` and `Box.extend()` agree without configuration; a vanilla app has no such
 * ambient thing to agree with, and an explicit instance is what makes two of them (a widget and
 * its host, say) independent.
 */
export { classNames } from './core/classNames';
export type { ClassNameType } from './core/classNames';
export { createStyleEngine, DEFAULT_STYLE_ELEMENT_ID } from './core/engine/styleEngine';
export type { StyleEngine, StyleEngineOptions, StylesConfiguration } from './core/engine/styleEngine';
export { manualScheduler, microtaskScheduler, syncScheduler } from './core/engine/flushScheduler';
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
