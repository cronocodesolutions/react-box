import { useCallback, useEffect, useRef, useState } from 'react';

interface Props<T extends HTMLElement = HTMLDivElement> {
  node?: Nullable<T>;
  event?: 'mousedown' | 'click';
  hideOnScroll?: boolean;
}

export default function useVisibility<T extends HTMLElement = HTMLDivElement>(
  props?: Props<T>,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>, React.RefObject<T>] {
  const { node = null, event = 'click', hideOnScroll = false } = props ?? {};
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

    // function resizeHandler() {
    //   setVisibility(false);
    // }

    function scrollHandler() {
      setVisibility(false);

      console.count('scrollHandler');
    }

    function hideVisibilityKeyboardHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') setVisibility(false);
    }

    if (isVisible) {
      window.addEventListener(event, clickHandler);
      // window.addEventListener('resize', resizeHandler);
      hideOnScroll && window.addEventListener('scroll', scrollHandler, true);
      window.addEventListener('keydown', hideVisibilityKeyboardHandler);
    }

    return () => {
      window.removeEventListener(event, clickHandler);
      // window.removeEventListener('resize', resizeHandler);
      hideOnScroll && window.removeEventListener('scroll', scrollHandler, true);
      window.removeEventListener('keydown', hideVisibilityKeyboardHandler);
    };
  }, [node, isVisible]);

  return [isVisible, setVisibility, visibilityRef];
}
