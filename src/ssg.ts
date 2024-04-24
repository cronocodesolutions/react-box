import React from 'react';
import StylesContext from './core/stylesContext';
import ReactDOMServer from 'react-dom/server';

const el = {
  innerHTML: '',
};
const document = {
  head: {
    insertBefore() {},
  },
  getElementById() {
    return el;
  },
  createElement() {
    return {
      setAttribute() {},
    };
  },
};

global.document = document as any;

export function renderToStaticMarkup(element: React.ReactElement, addStylesToHead = true) {
  let html = ReactDOMServer.renderToStaticMarkup(element);
  StylesContext.flush();

  if (addStylesToHead) {
    const head = '<head>';
    const headIndex = html.indexOf(head);

    if (headIndex > -1) {
      const styles = `<style id="crono-styles">${el.innerHTML}</style>`;
      const stylesLocationIndex = headIndex + head.length;

      html = html.substring(0, stylesLocationIndex) + styles + html.substring(stylesLocationIndex);
    }
  }

  StylesContext.clear();

  return {
    html,
    styles: el.innerHTML,
  };
}
