import { createPortal } from 'react-dom';
import Box from '../../box';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import usePortalContainer from '../../hooks/usePortalContainer';

const positionDigitsAfterComma = 2;

interface Props extends React.ComponentProps<typeof Box> {
  onPositionChange?(position: { top: number; left: number }): void;
}

export default function Tooltip(props: Props) {
  const { onPositionChange } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width?: number } | undefined>();
  const portalContainer = usePortalContainer();

  const observeScroll = useCallback((element: HTMLDivElement, callback: (el: HTMLDivElement) => void) => {
    const listener = (e: Event) => {
      if ((e.target as HTMLElement).contains(element)) {
        callback(element);
      }
    };

    document.addEventListener('scroll', listener, { capture: true });
    return () => {
      document.removeEventListener('scroll', listener, { capture: true });
    };
  }, []);

  const observeResize = useCallback((element: HTMLDivElement, callback: (el: HTMLDivElement) => void) => {
    const listener = (e: Event) => {
      callback(element);
    };

    window.addEventListener('resize', listener, { capture: true });
    return () => {
      window.removeEventListener('resize', listener, { capture: true });
    };
  }, []);

  const positionHandler = useCallback((el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();

    const top = Math.round((rect.top + window.scrollY) * positionDigitsAfterComma) / positionDigitsAfterComma;
    const left = Math.round((rect.left + window.scrollX) * positionDigitsAfterComma) / positionDigitsAfterComma;

    if (position?.top !== top || position?.left !== left) {
      onPositionChange?.({ top, left });
      setPosition({ top, left, width: rect.width > 0 ? rect.width : undefined });
    }
  }, []);

  useLayoutEffect(() => {
    if (ref.current) {
      positionHandler(ref.current);
      const scrollHandlerDispose = observeScroll(ref.current, positionHandler);
      const resizeHandlerDispose = observeResize(ref.current, positionHandler);

      return () => {
        scrollHandlerDispose();
        resizeHandlerDispose();
      };
    }
  }, []);

  return (
    <>
      <Box ref={ref} />
      {position &&
        createPortal(
          <Box
            position="absolute"
            top={0}
            left={0}
            transition="none"
            style={{ transform: `translate(${position.left}px,${position.top}px)`, width: position.width }}
          >
            <Box position="absolute" width="fit" {...props} />
          </Box>,
          portalContainer,
        )}
    </>
  );
}
