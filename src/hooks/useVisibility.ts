import { useCallback, useEffect, useRef, useState } from 'react';

interface Props<T extends HTMLElement = HTMLDivElement> {
  node?: Nullable<T>;
  event?: 'mousedown' | 'click';
  hideOnScroll?: boolean;
  hideOnResize?: boolean;
  hideOnEscape?: boolean;
}

export default function useVisibility<T extends HTMLElement = HTMLDivElement>(
  props?: Props<T>,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>, React.RefObject<T>] {
  const { node = null, event = 'click', hideOnScroll = false, hideOnResize = false, hideOnEscape = true } = props ?? {};
  const [isVisible, setVisibility] = useState(false);

  const visibilityRef = useRef<T>(null);

  useEffect(() => {
    function clickHandler(e: MouseEvent) {
      const el = node ?? visibilityRef.current;
      const shouldHide = el?.contains(e.target as Node) === false;

      if (shouldHide) {
        setVisibility(false);
      }
    }

    function resizeHandler() {
      setVisibility(false);
    }

    function scrollHandler(e: Event) {
      const el = node ?? visibilityRef.current;
      const shouldHide = el?.contains(e.target as Node) === false;

      console.log({ shouldHide, cont: el?.contains(e.target as Node) });

      if (shouldHide) {
        setVisibility(false);
      }
    }

    function hideVisibilityKeyboardHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') setVisibility(false);
    }

    const controller = new AbortController();

    if (isVisible) {
      window.addEventListener(event, clickHandler, controller);

      hideOnEscape && window.addEventListener('keydown', hideVisibilityKeyboardHandler, controller);
      hideOnResize && window.addEventListener('resize', resizeHandler, controller);
      hideOnScroll && window.addEventListener('scroll', scrollHandler, { signal: controller.signal, capture: true });
    }

    return () => {
      controller.abort();
    };
  }, [node, isVisible]);

  return [isVisible, setVisibility, visibilityRef];
}
