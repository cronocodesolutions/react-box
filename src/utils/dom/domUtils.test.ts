import { afterEach, describe, expect, it } from 'vitest';
import { elementOf, htmlElementOf, isEventInside } from './domUtils';

describe('DomUtils', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function render(html: string): HTMLElement {
    document.body.innerHTML = html;

    return document.body.firstElementChild as HTMLElement;
  }

  describe('elementOf', () => {
    it('takes an element as it is', () => {
      const element = render('<div></div>');

      expect(elementOf(element)).toBe(element);
    });

    it('reads a ref', () => {
      const element = render('<div></div>');

      expect(elementOf({ current: element })).toBe(element);
    });

    it('answers null for nothing at all — an unattached ref, or a caller with no element yet', () => {
      expect(elementOf({ current: null })).toBeNull();
      expect(elementOf(null)).toBeNull();
      expect(elementOf(undefined)).toBeNull();
    });
  });

  describe('htmlElementOf', () => {
    it('narrows to an HTML element', () => {
      const element = render('<button></button>');

      expect(htmlElementOf({ current: element })).toBe(element);
    });

    it('rejects an element that cannot be focused or styled as one', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

      expect(htmlElementOf(svg)).toBeNull();
    });
  });

  describe('isEventInside', () => {
    it('is true for the element the event came from', () => {
      const popup = render('<div><button id="ok">OK</button></div>');
      const event = new MouseEvent('pointerdown', { bubbles: true, composed: true });

      document.getElementById('ok')!.dispatchEvent(event);

      expect(isEventInside(event, [popup])).toBe(true);
    });

    it('is false for an event from elsewhere on the page', () => {
      const popup = render('<div id="popup"></div><button id="away">Away</button>');
      const event = new MouseEvent('pointerdown', { bubbles: true, composed: true });

      document.getElementById('away')!.dispatchEvent(event);

      expect(isEventInside(event, [popup])).toBe(false);
    });

    it('takes refs and skips the ones holding nothing', () => {
      const popup = render('<div><span id="inner">x</span></div>');
      const event = new MouseEvent('pointerdown', { bubbles: true, composed: true });

      document.getElementById('inner')!.dispatchEvent(event);

      expect(isEventInside(event, [{ current: null }, { current: popup }])).toBe(true);
    });

    it('is false when there is nothing to be inside of', () => {
      const event = new MouseEvent('pointerdown');

      expect(isEventInside(event, [])).toBe(false);
    });

    /**
     * `composedPath()` is only populated while an event is being dispatched, and it returns an
     * empty array once dispatch is over. The `contains()` fallback is what keeps a handler that
     * looks at an event later — or one running where the method is missing — from reading every
     * event as "outside" and closing popups the user is clicking inside.
     */
    it('falls back to containment when the composed path is unavailable', () => {
      const popup = render('<div><span id="inner">x</span></div>');
      const target = document.getElementById('inner')!;
      const event = new MouseEvent('pointerdown');
      Object.defineProperty(event, 'target', { value: target });
      Object.defineProperty(event, 'composedPath', { value: undefined });

      expect(isEventInside(event, [popup])).toBe(true);
    });
  });
});
