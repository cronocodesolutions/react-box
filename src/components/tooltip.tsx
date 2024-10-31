import { createPortal } from 'react-dom';
import Box, { BoxProps } from '../box';
import { forwardRef, Ref, useCallback, useLayoutEffect, useRef, useState } from 'react';
import usePortalContainer from '../hooks/usePortalContainer';

const positionDigitsAfterComma = 2;

interface Props extends BoxProps {
  onPositionChange?(position: { top: number; left: number }): void;
}

function Tooltip(props: Props, ref: Ref<HTMLDivElement>) {
  const { onPositionChange } = props;
  const positionRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width?: number } | undefined>();
  const portalContainer = usePortalContainer();

  const observeScroll = useCallback(
    (element: HTMLDivElement, callback: (el: HTMLDivElement) => void) => {
      const listener = (e: Event) => {
        if ((e.target as HTMLElement).contains(element)) {
          callback(element);
        }
      };

      document.addEventListener('scroll', listener, { capture: true });
      return () => {
        document.removeEventListener('scroll', listener, { capture: true });
      };
    },
    [position],
  );

  const observeResize = useCallback(
    (element: HTMLDivElement, callback: (el: HTMLDivElement) => void) => {
      const listener = (e: Event) => {
        callback(element);
      };

      window.addEventListener('resize', listener, { capture: true });
      return () => {
        window.removeEventListener('resize', listener, { capture: true });
      };
    },
    [position],
  );

  const positionHandler = useCallback(
    (el: HTMLDivElement) => {
      const rect = el.getBoundingClientRect();

      const top = Math.round((rect.top + window.scrollY) * positionDigitsAfterComma) / positionDigitsAfterComma;
      const left = Math.round((rect.left + window.scrollX) * positionDigitsAfterComma) / positionDigitsAfterComma;

      if (position?.top !== top || position?.left !== left) {
        onPositionChange?.({ top, left });
        setPosition({ top, left, width: rect.width > 0 ? rect.width : undefined });
      }
    },
    [position],
  );

  useLayoutEffect(() => {
    if (positionRef.current) {
      positionHandler(positionRef.current);
      const scrollHandlerDispose = observeScroll(positionRef.current, positionHandler);
      const resizeHandlerDispose = observeResize(positionRef.current, positionHandler);

      return () => {
        scrollHandlerDispose();
        resizeHandlerDispose();
      };
    }
  }, [position]);

  return (
    <>
      <Box ref={positionRef} />
      {position &&
        createPortal(
          <Box
            ref={ref}
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

export default forwardRef(Tooltip);
