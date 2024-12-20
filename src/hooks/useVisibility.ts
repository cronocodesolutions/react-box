import { useCallback, useEffect, useRef, useState } from 'react';

export default function useVisibility<T extends HTMLElement = HTMLDivElement>(
  node: Nullable<T> = null,
  event: 'mousedown' | 'click' = 'click',
): [boolean, React.Dispatch<React.SetStateAction<boolean>>, React.RefObject<T>] {
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

    // function scrollHandler() {
    //   setVisibility(false);

    //   console.count('scrollHandler');
    // }

    function hideVisibilityKeyboardHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') setVisibility(false);
    }

    if (isVisible) {
      window.addEventListener(event, clickHandler);
      // window.addEventListener('resize', resizeHandler);
      // window.addEventListener('scroll', scrollHandler, true);
      window.addEventListener('keydown', hideVisibilityKeyboardHandler);
    }

    return () => {
      window.removeEventListener(event, clickHandler);
      // window.removeEventListener('resize', resizeHandler);
      // window.removeEventListener('scroll', scrollHandler, true);
      window.removeEventListener('keydown', hideVisibilityKeyboardHandler);
    };
  }, [node, isVisible]);

  return [isVisible, setVisibility, visibilityRef];
}
