import { useEffect, useRef, useState } from 'react';
import { isEventInside } from '../../utils/dom/domUtils';

interface Props<T extends HTMLElement = HTMLDivElement> {
  node?: T | null;
  event?: 'mousedown' | 'click';
  hideOnScroll?: boolean;
  hideOnResize?: boolean;
  hideOnEscape?: boolean;
}

export default function useVisibility<T extends HTMLElement = HTMLDivElement>(
  props?: Props<T>,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>, React.RefObject<T | null>] {
  const { node = null, event = 'click', hideOnScroll = false, hideOnResize = false, hideOnEscape = true } = props ?? {};
  const [isVisible, setVisibility] = useState(false);

  const visibilityRef = useRef<T>(null);

  useEffect(() => {
    /** A click or a scroll that happened outside the tracked element hides it; one inside does not. */
    function hideIfOutside(e: Event) {
      const el = node ?? visibilityRef.current;

      if (el && !isEventInside(e, [el])) {
        setVisibility(false);
      }
    }

    function resizeHandler() {
      setVisibility(false);
    }

    function hideVisibilityKeyboardHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') setVisibility(false);
    }

    const controller = new AbortController();

    if (isVisible) {
      window.addEventListener(event, hideIfOutside, controller);

      hideOnEscape && window.addEventListener('keydown', hideVisibilityKeyboardHandler, controller);
      hideOnResize && window.addEventListener('resize', resizeHandler, controller);
      hideOnScroll && window.addEventListener('scroll', hideIfOutside, { signal: controller.signal, capture: true });
    }

    return () => {
      controller.abort();
    };
  }, [node, isVisible, event, hideOnEscape, hideOnResize, hideOnScroll]);

  return [isVisible, setVisibility, visibilityRef];
}
