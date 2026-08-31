import { ElementLike, elementOf, isEventInside } from '../../utils/dom/domUtils';
import { useIsomorphicLayoutEffect } from '../effects';
import { useEventCallback, useLatest } from './callbacks';

export type DismissReason = 'escape' | 'outside-pointer';

export type { ElementLike };

export interface DismissOptions {
  /** Usually the open state: listeners exist only while this is true. */
  enabled?: boolean;
  onDismiss: (reason: DismissReason, event: Event) => void;
  /**
   * What counts as *inside*: the popup, and the trigger too — a press on the trigger of an open popup must
   * reach its own toggle rather than being dismissed and reopened in one gesture.
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
 * Every layer currently listening. Escape closes the innermost one, and without a shared registry a
 * dialog containing an open select would close both on one press. Module state is right: the registry
 * describes the page, and every layer is rendered into the same document.
 */
const layers: Layer[] = [];

/** Whether any element of `outer` contains any element of `inner`. */
function wraps(outer: Layer, inner: Layer): boolean {
  const inside = inner.elements();

  return outer.elements().some((element) => inside.some((candidate) => element !== candidate && element.contains(candidate)));
}

/**
 * The layer Escape belongs to, worked out from the DOM rather than registration order — React runs a
 * child's effects first, so a dialog and the select inside it register select-first and a stack would
 * call the dialog innermost. Containment says what nesting is; among layers containing no other layer,
 * the most recently opened wins, which is the one the user is looking at.
 */
function innermost(): Layer | undefined {
  const candidates = layers.filter((layer) => !layers.some((other) => other !== layer && wraps(layer, other)));

  return candidates[candidates.length - 1];
}

/**
 * Close on Escape and on a pointer press outside — the two halves of light dismiss, composable across
 * nested layers: Escape reaches the innermost only, while an outside press is judged per layer, so a
 * press in the page closes a menu and its submenu and a press in the menu closes just the submenu.
 * `pointerdown` rather than `click`, because a press that starts inside and ends outside (a drag across a
 * scrollbar, a text selection) is not a dismissal.
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
      elements: () => (insideRef.current ?? []).map((value) => elementOf(value)).filter((element): element is Element => element !== null),
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
        if (isEventInside(event, insideRef.current ?? [])) return;

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
