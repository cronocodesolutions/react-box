import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StylesContext } from './core/useStyles';

const el = {
  innerHTML: '',
  get textContent() {
    return this.innerHTML;
  },
  set textContent(value: string) {
    this.innerHTML = value;
  },
};
const document: Partial<Document> = {
  head: {
    insertBefore<T extends Node>(node: T, _child: Node | null): T {
      return node;
    },
  } as unknown as HTMLHeadElement,
  getElementById() {
    return el as HTMLElement;
  },
  createElement() {
    return {
      setAttribute(_name: string, _value: string) {},
    } as unknown as HTMLElement;
  },
};

global.document = document as Document;

export function renderToStaticMarkup(element: React.ReactElement, addStylesToHead = true) {
  // Clear innerHTML before each render for SSG
  el.innerHTML = '';

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

  const styles = el.innerHTML;

  StylesContext.clear();

  return {
    html,
    styles,
  };
}
