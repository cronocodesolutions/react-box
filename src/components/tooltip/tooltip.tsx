import { createPortal } from 'react-dom';
import Box from '../../box';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { BoxPosition } from '../../types';
import usePortalContainer from '../../hooks/usePortalContainer';

interface Props extends BoxPosition {
  children: React.ReactNode;
  style?: React.ComponentProps<'div'>['style'];
  onPositionChange?(position: { top: number; left: number }): void;
}

export default function Tooltip(props: Props) {
  const { children, onPositionChange } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | undefined>();
  const portalContainer = usePortalContainer();

  const observeScroll = useCallback(
    (element: HTMLElement, callback: () => void) => {
      const listener = (e: Event) => {
        if ((e.target as HTMLElement).contains(element)) {
          callback();
        }
      };

      document.addEventListener('scroll', listener, { capture: true });
      return () => {
        document.removeEventListener('scroll', listener, { capture: true });
      };
    },
    [position, ref],
  );

  const observeResize = useCallback(
    (element: HTMLElement, callback: () => void) => {
      const listener = (e: Event) => {
        callback();
      };

      window.addEventListener('resize', listener, { capture: true });
      return () => {
        window.removeEventListener('resize', listener, { capture: true });
      };
    },
    [position, ref],
  );

  const positionHandler = useCallback(
    (element: HTMLDivElement) => {
      return () => {
        const rect = element.getBoundingClientRect();

        const top = rect.top + window.scrollY;
        const left = rect.left + window.scrollX;

        if (position?.top !== top || position?.left !== left) {
          onPositionChange?.({ top, left });
          setPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
        }
      };
    },
    [position, ref],
  );

  useLayoutEffect(() => {
    if (ref.current) {
      positionHandler(ref.current)();
      const scrollHandlerDispose = observeScroll(ref.current, positionHandler(ref.current));
      const resizeHandlerDispose = observeResize(ref.current, positionHandler(ref.current));

      return () => {
        scrollHandlerDispose();
        resizeHandlerDispose();
      };
    }
  }, [position, ref]);

  return (
    <>
      <Box ref={ref} position="absolute" top={0} left={0} {...props} children={undefined} />
      {position &&
        createPortal(
          <Box
            position="absolute"
            top={0}
            left={0}
            transition="none"
            style={{ transform: `translate(${position.left}px,${position.top}px)` }}
          >
            {children}
          </Box>,
          portalContainer,
        )}
    </>
  );
}
