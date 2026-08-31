/**
 * The one name the prerender pass and the browser entry both have to know: the `<style>` element
 * `scripts/prerender-pages.mjs` writes each route's CSS into. It is deliberately *not* the engine's
 * own id — the engine reuses an element with that id and would insert its rules into the middle of a
 * sheet it did not write. This copy is dropped once hydration has replaced it.
 */
export const PRERENDERED_STYLE_ID = 'crono-prerendered-styles';
