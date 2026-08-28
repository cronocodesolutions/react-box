import { useEventCallback, useIsomorphicLayoutEffect, useLatest } from './effects';

export type DismissReason = 'escape' | 'outside-pointer';

/** A ref or the element itself — whichever the caller happens to be holding. */
export type ElementLike = React.RefObject<Element | null> | Element | null | undefined;

export interface DismissOptions {
  /** Usually the open state: listeners exist only while this is true. */
  enabled?: boolean;
  onDismiss: (reason: DismissReason, event: Event) => void;
  /**
   * What counts as *inside*. The popup, and the trigger too — a pointer press on the trigger of an
   * open popup must reach the trigger's own toggle, not be read as a press outside it and dismissed
   * and reopened in the same gesture.
   */
  inside?: ReadonlyArray<ElementLike>;
  /** Default true. */
  escapeKey?: boolean;
  /** Default true. */
  outsidePointer?: boolean;
}

interface Layer {
  /** The layer's own elements, read at event time — refs are empty when the layer registers. */
  elements: () => ReadonlyArray<Element>;
}

/**
 * Every layer currently listening.
 *
 * Escape closes one thing: the innermost. Without a shared registry a dialog containing an open
 * select would close both on a single press, because each layer only knows about itself. Module
 * state is right here — the registry describes the page, and these layers are all rendered into
 * the same document by the same React runtime.
 */
const layers: Layer[] = [];

function elementOf(value: ElementLike): Element | null {
  if (!value) return null;

  return 'current' in value ? value.current : value;
}

/** Whether any element of `outer` contains any element of `inner`. */
function wraps(outer: Layer, inner: Layer): boolean {
  const inside = inner.elements();

  return outer.elements().some((element) => inside.some((candidate) => element !== candidate && element.contains(candidate)));
}

/**
 * The layer Escape belongs to, worked out from the DOM rather than from registration order.
 *
 * Order of registration is tempting and wrong: React runs a child's effects before its parent's,
 * so a dialog and the select inside it register *select first* when they mount together, and a
 * stack would call the dialog innermost. Containment says what nesting actually is. Layers that
 * contain no other layer are all candidates — two popups side by side, or one portalled out of the
 * other's subtree — and the most recently opened of those wins, which is the one the user is
 * looking at.
 */
function innermost(): Layer | undefined {
  const candidates = layers.filter((layer) => !layers.some((other) => other !== layer && wraps(layer, other)));

  return candidates[candidates.length - 1];
}

/** Whether an event happened inside one of the given elements, shadow DOM included. */
function isInside(event: Event, elements: ReadonlyArray<ElementLike>): boolean {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];

  return elements.some((value) => {
    const element = elementOf(value);
    if (!element) return false;

    return path.includes(element) || (event.target instanceof Node && element.contains(event.target));
  });
}

/**
 * Close on Escape and on a pointer press outside — the two halves of "light dismiss", composable
 * across nested layers.
 *
 * Escape goes to the innermost layer only. An outside press is judged by each layer for itself, so
 * a press in the page closes a menu and its submenu together, while a press in the menu closes only
 * the submenu.
 *
 * `pointerdown` rather than `click`: dismissal should happen when the gesture starts, and a press
 * that starts inside the popup and ends outside it (a drag across a scrollbar, a text selection) is
 * not a dismissal at all — a `click` listener treats it as one.
 */
export default function useDismiss(options: DismissOptions): void {
  const { enabled = true, onDismiss, inside, escapeKey = true, outsidePointer = true } = options;

  // Read at event time, never at effect time: the array is written inline by every caller, so a
  // dependency on it would re-register the listeners on every render.
  const insideRef = useLatest(inside);
  const dismiss = useEventCallback(onDismiss);

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return;

    const layer: Layer = {
      elements: () => (insideRef.current ?? []).map(elementOf).filter((element): element is Element => element !== null),
    };
    layers.push(layer);

    const controller = new AbortController();
    const listen = (type: string, handler: (event: Event) => void) =>
      document.addEventListener(type, handler, { signal: controller.signal });

    if (escapeKey) {
      listen('keydown', (event) => {
        // `defaultPrevented` is how a consumer says it handled Escape itself — clearing a search
        // box inside the popup, for instance, which should not also close the popup.
        if ((event as KeyboardEvent).key !== 'Escape' || event.defaultPrevented) return;
        if (innermost() !== layer) return;

        dismiss('escape', event);
      });
    }

    if (outsidePointer) {
      listen('pointerdown', (event) => {
        if (isInside(event, insideRef.current ?? [])) return;

        dismiss('outside-pointer', event);
      });
    }

    return () => {
      controller.abort();

      const index = layers.indexOf(layer);
      if (index !== -1) layers.splice(index, 1);
    };
  }, [enabled, escapeKey, outsidePointer, dismiss, insideRef]);
}
