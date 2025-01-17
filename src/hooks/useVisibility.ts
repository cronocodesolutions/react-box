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

    function scrollHandler() {
      setVisibility(false);
    }

    function hideVisibilityKeyboardHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') setVisibility(false);
    }

    if (isVisible) {
      window.addEventListener(event, clickHandler);

      hideOnEscape && window.addEventListener('keydown', hideVisibilityKeyboardHandler, true);
      hideOnResize && window.addEventListener('resize', resizeHandler, true);
      hideOnScroll && window.addEventListener('scroll', scrollHandler, true);
    }

    return () => {
      window.removeEventListener(event, clickHandler);

      hideOnEscape && window.removeEventListener('keydown', hideVisibilityKeyboardHandler, true);
      hideOnResize && window.removeEventListener('resize', resizeHandler, true);
      hideOnScroll && window.removeEventListener('scroll', scrollHandler, true);
    };
  }, [node, isVisible]);

  return [isVisible, setVisibility, visibilityRef];
}
