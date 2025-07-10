import { forwardRef, Ref, RefAttributes, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Box, { BoxProps } from '../box';
import { ExtractElementFromTag } from '../core/coreTypes';
import usePortalContainer from '../hooks/usePortalContainer';
import { ComponentsAndVariants } from '../types';

const positionDigitsAfterComma = 2;

interface TooltipProps {
  onPositionChange?(position: { top: number; left: number }): void;
}

type Props = TooltipProps & BoxProps;

function TooltipImpl(props: Props, ref: Ref<HTMLDivElement>) {
  const { onPositionChange, ...restProps } = props;
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

      const controller = new AbortController();
      document.addEventListener('scroll', listener, { signal: controller.signal, capture: true });
      return () => controller.abort();
    },
    [position],
  );

  const observeResize = useCallback(
    (element: HTMLDivElement, callback: (el: HTMLDivElement) => void) => {
      const listener = (_e: Event) => {
        callback(element);
      };

      const controller = new AbortController();
      window.addEventListener('resize', listener, { signal: controller.signal, capture: true });
      return () => controller.abort();
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
            <Box {...restProps} />
          </Box>,
          portalContainer,
        )}
    </>
  );
}

const Tooltip = forwardRef(TooltipImpl);
Tooltip.displayName = 'Tooltip';

export default Tooltip as <TTag extends keyof React.JSX.IntrinsicElements = 'div', TKey extends keyof ComponentsAndVariants = never>(
  props: BoxProps<TTag, TKey> & RefAttributes<ExtractElementFromTag<TTag>> & TooltipProps,
) => React.ReactNode;
