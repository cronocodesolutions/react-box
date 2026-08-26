import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StylesContext } from './core/useStyles';

/**
 * Server rendering. There is no DOM here and the engine does not pretend there is one: with no
 * `document` in the process it writes to an in-memory string sink, and `getStyles()` reads it back.
 */

/**
 * The CSS for everything rendered since the last reset. Flushes the engine first, so it is safe to
 * call straight after `renderToString`/`renderToStaticMarkup` — no effects have run at that point.
 * Put the result in a `<style id="crono-styles">` tag in the document head.
 */
export function getStyles(): string {
  return StylesContext.getStyles();
}

/**
 * Drop every rule, class name and variable the engine has emitted, so the next request starts from
 * a blank sheet. Registration — `Box.extend()`, `Box.components()` — survives. Call it once per
 * request, after `getStyles()`.
 */
export function resetStyles(): void {
  StylesContext.clear();
}

/**
 * Render `element` to static HTML together with its CSS. When `addStylesToHead` is set (the
 * default) and the tree renders a `<head>`, the styles are injected there; otherwise use the
 * returned `styles` string. The engine is reset before returning, so sequential calls are
 * independent.
 */
export function renderToStaticMarkup(element: React.ReactElement, addStylesToHead = true) {
  let html = ReactDOMServer.renderToStaticMarkup(element);
  const styles = getStyles();

  if (addStylesToHead) {
    const head = '<head>';
    const headIndex = html.indexOf(head);

    if (headIndex > -1) {
      const stylesLocationIndex = headIndex + head.length;

      html =
        html.substring(0, stylesLocationIndex) +
        `<style id="${StylesContext.styleElementId()}">${styles}</style>` +
        html.substring(stylesLocationIndex);
    }
  }

  resetStyles();

  return {
    html,
    styles,
  };
}
