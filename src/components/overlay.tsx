import { forwardRef, Ref, RefAttributes, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Box, { BoxProps } from '../box';
import usePortalContainer from '../react/hooks/usePortalContainer';
import { ExtractElementFromTag } from '../react/reactTypes';
import { ComponentsAndVariants } from '../types';

const positionDigitsAfterComma = 2;

/**
 * A floating layer, rendered into the portal container at the place it is declared.
 *
 * This is the positioning half of every popup in the library, and nothing else: it measures where
 * it sits in the layout, then renders its children into `#crono-box` translated to that spot, so
 * they escape `overflow: hidden`, clipped ancestors and stacking contexts. It owns no open state,
 * no ARIA and no dismissal — a layer is not a pattern, and the components built on it (`Tooltip`,
 * `Dropdown`, the DataGrid menu) each need a different one.
 *
 * This component was called `Tooltip` until A3, which is the one thing it is not: the APG tooltip
 * is a described-by popup with a trigger, a delay and an Escape key, and that pattern now owns the
 * name. Code that used the old component only to escape an overflow is this component, unchanged.
 */
interface OverlayProps {
  onPositionChange?(position: { top: number; left: number; windowScrollX: number; windowScrollY: number }): void;
  adjustTranslateX?: string;
  adjustTranslateY?: string;
  /**
   * Whether the layer takes the measured width of the space it was declared in. Default true, so a
   * dropdown popup lines up with its trigger; a tooltip sizes to its own content and turns it off.
   */
  matchWidth?: boolean;
}

type Props = OverlayProps & BoxProps;

function OverlayImpl(props: Props, ref: Ref<HTMLDivElement>) {
  const { onPositionChange, adjustTranslateX = '0px', adjustTranslateY = '0px', matchWidth = true, ...restProps } = props;

  const positionRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<
    { top: number; left: number; width?: number; windowScrollX: number; windowScrollY: number } | undefined
  >();
  const portalContainer = usePortalContainer();

  const observeScroll = useCallback((element: HTMLDivElement, callback: (el: HTMLDivElement) => void) => {
    const listener = (e: Event) => {
      if ((e.target as HTMLElement).contains(element)) {
        callback(element);
      }
    };

    const controller = new AbortController();
    document.addEventListener('scroll', listener, { signal: controller.signal, capture: true });
    return () => controller.abort();
  }, []);

  const observeResize = useCallback((element: HTMLDivElement, callback: (el: HTMLDivElement) => void) => {
    const listener = (_e: Event) => {
      callback(element);
    };

    const controller = new AbortController();
    window.addEventListener('resize', listener, { signal: controller.signal, capture: true });
    return () => controller.abort();
  }, []);

  const positionHandler = useCallback(
    (el: HTMLDivElement) => {
      const rect = el.getBoundingClientRect();

      const top = Math.round((rect.top + window.scrollY) * positionDigitsAfterComma) / positionDigitsAfterComma;
      const left = Math.round((rect.left + window.scrollX) * positionDigitsAfterComma) / positionDigitsAfterComma;
      const windowScrollX = window.scrollX;
      const windowScrollY = window.scrollY;

      if (
        position?.top !== top ||
        position?.left !== left ||
        position?.windowScrollX !== windowScrollX ||
        position?.windowScrollY !== windowScrollY
      ) {
        onPositionChange?.({ top, left, windowScrollX, windowScrollY });
        setPosition({ top, left, width: rect.width > 0 ? rect.width : undefined, windowScrollX, windowScrollY });
      }
    },
    [position, onPositionChange],
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
  }, [positionHandler, observeScroll, observeResize]);

  return (
    <>
      <Box ref={positionRef} />
      {position &&
        portalContainer &&
        createPortal(
          <Box
            ref={ref}
            position="absolute"
            top={0}
            left={0}
            transition="none"
            style={{
              transform: `translate3d(calc(${position.left}px + ${adjustTranslateX}),calc(${position.top}px + ${adjustTranslateY}), 0)`,
              willChange: 'transform',
              width: matchWidth ? position.width : undefined,
            }}
          >
            <Box {...restProps} />
          </Box>,
          portalContainer,
        )}
    </>
  );
}

const Overlay = forwardRef(OverlayImpl);
Overlay.displayName = 'Overlay';

export default Overlay as <TTag extends keyof React.JSX.IntrinsicElements = 'div', TKey extends keyof ComponentsAndVariants = never>(
  props: BoxProps<TTag, TKey> & RefAttributes<ExtractElementFromTag<TTag>> & OverlayProps,
) => React.ReactNode;
