import { useEffect, useState } from 'react';
import { ElementLike, htmlElementOf } from '../../utils/dom/domUtils';
import { documentOrNull } from '../../utils/environment/environmentUtils';
import { useEventCallback } from './callbacks';

export interface FocusReturnOptions {
  /** Usually the open state. The invoker is remembered the moment this becomes true. */
  enabled?: boolean;
  /** Where focus should land instead of whatever had it when the layer opened. */
  returnTo?: ElementLike;
  /** Passed to `focus()` — keeps a long page from jumping when the invoker is off screen. */
  preventScroll?: boolean;
}

/** Whatever holds focus right now, or null when that is the body — or when there is no document. */
function focused(): HTMLElement | null {
  const activeElement = documentOrNull()?.activeElement;

  return activeElement && activeElement !== document.body ? (activeElement as HTMLElement) : null;
}

/**
 * Put focus back where it came from when a layer closes.
 *
 * Losing focus to `<body>` is the single most common keyboard bug in a popup: the trigger is gone
 * as far as the tab order is concerned, so the next Tab starts again at the top of the page and a
 * keyboard user has to walk all the way back to where they were.
 *
 * The restore is skipped when something else already holds focus — a menu item that moved focus
 * into a dialog it opened, or a user who tabbed away before the popup closed — because taking it
 * back would be the same bug pointing the other way.
 */
export default function useFocusReturn(options: FocusReturnOptions = {}): { returnFocus: () => void } {
  const { enabled = true, returnTo, preventScroll } = options;

  const [invoker, setInvoker] = useState<HTMLElement | null>(null);
  const [wasEnabled, setWasEnabled] = useState(false);

  // Captured during render, on the edge where the layer opens — not from an effect. By the time
  // any effect runs the layer has already taken focus (an `autoFocus` attribute is applied during
  // the commit, ahead of the parent's own effects), so an effect would remember the popup's own
  // first control as the invoker and hand focus to a node that is about to be removed.
  if (enabled !== wasEnabled) {
    setWasEnabled(enabled);
    if (enabled) setInvoker(focused());
  }

  const returnFocus = useEventCallback(() => {
    const target = htmlElementOf(returnTo) ?? invoker;

    target?.focus({ preventScroll });
  });

  /**
   * A passive effect on purpose. Its cleanup runs after React has removed the closed layer from
   * the DOM, which is what makes "does anything still hold focus?" a question worth asking; a
   * layout effect would ask it while the element about to be deleted still has it.
   */
  useEffect(() => {
    if (!enabled) return;

    return () => {
      const active = document.activeElement;
      // Nothing holds focus (it fell to the body when the layer was removed), or what holds it has
      // been removed from the document along with the layer.
      const focusIsLoose = !active || active === document.body || !document.contains(active);

      if (focusIsLoose) returnFocus();
    };
  }, [enabled, returnFocus]);

  return { returnFocus };
}
