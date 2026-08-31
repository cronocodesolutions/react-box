import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

export type ArrowDirection = 'Up' | 'Down' | 'Left' | 'Right';

export interface Keyboard {
  /** Move focus forward, as Tab does — through the real tab order, not a simulated event. */
  pressTab(): Promise<void>;
  /** Move focus backward (Shift+Tab). */
  pressShiftTab(): Promise<void>;
  /** An arrow key on whatever has focus — the APG list/grid navigation key. */
  pressArrow(direction: ArrowDirection): Promise<void>;
  /** Any other named key on whatever has focus: `Enter`, `Escape`, `Home`, `End`, `PageDown`, ` `. */
  press(key: string): Promise<void>;
  /** The same with Ctrl held. Ctrl+Home and Ctrl+End are the grid pattern's corners. */
  pressCtrl(key: string): Promise<void>;
  /** Type printable characters into whatever has focus — typeahead, search boxes. */
  type(text: string): Promise<void>;
  /** A real pointer click, for the "open it with the mouse, then drive it with the keyboard" case. */
  click(element: Element): Promise<void>;
  /**
   * Move the pointer onto an element, firing the whole `pointerover`/`pointerenter`/`mouseover`
   * sequence React synthesizes `onPointerEnter` from — a bare `pointerenter` never reaches it.
   */
  hover(element: Element): Promise<void>;
  /** Move the pointer off an element. Paired with `hover` this is what WCAG 1.4.13 is about. */
  unhover(element: Element): Promise<void>;
}

/**
 * A keyboard driving the document, for tests that have to prove a pattern works without a mouse. Over
 * `fireEvent`, which dispatches a `keydown` and stops: this moves DOM focus, respects `tabindex` and
 * `disabled`, and fires the whole key sequence, so a test can assert *where focus went*. Call it before
 * `render` — user-event installs its listeners at setup time.
 */
export function keyboard(): Keyboard {
  const user = userEvent.setup();

  return {
    pressTab: () => user.tab(),
    pressShiftTab: () => user.tab({ shift: true }),
    pressArrow: (direction) => user.keyboard(`{Arrow${direction}}`),
    press: (key) => user.keyboard(`{${key}}`),
    pressCtrl: (key) => user.keyboard(`{Control>}{${key}}{/Control}`),
    type: (text) => user.keyboard(text),
    click: (element) => user.click(element),
    hover: (element) => user.hover(element),
    unhover: (element) => user.unhover(element),
  };
}

/** `button "Save"` — enough to tell two elements apart in a failure message. */
function describeElement(element: Element | null | undefined): string {
  if (!element) return String(element);
  if (element === document.body) return 'document.body (nothing is focused)';

  const label = element.getAttribute('aria-label') ?? element.textContent?.trim().slice(0, 40);

  return label ? `${element.tagName.toLowerCase()} "${label}"` : element.tagName.toLowerCase();
}

/** Asserts which element has DOM focus, and says what has it instead when it does not. */
export function expectFocusOn(element: Element | null | undefined): void {
  expect(
    document.activeElement,
    `expected focus on ${describeElement(element)}, but it is on ${describeElement(document.activeElement)}`,
  ).toBe(element);
}
