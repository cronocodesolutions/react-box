import { forwardRef, Ref, RefAttributes, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Box, { BoxProps } from '../box';
import usePortalContainer from '../react/hooks/usePortalContainer';
import { ExtractElementFromTag } from '../react/reactTypes';
import { ComponentsAndVariants } from '../types';
import { ElementLike, htmlElementOf } from '../utils/dom/domUtils';

const positionDigitsAfterComma = 2;

/**
 * A floating layer, rendered into the portal container at the place it is declared: it measures where it
 * sits, then renders its children into `#crono-box` translated to that spot, so they escape
 * `overflow: hidden` and every clipped ancestor. It owns no open state, no ARIA and no dismissal — a
 * layer is not a pattern, and `Tooltip`, `Dropdown` and the DataGrid menu each need a different one.
 * (This was called `Tooltip` until A3, which is the one thing it is not.)
 */
interface OverlayProps {
  onPositionChange?(position: { top: number; left: number; windowScrollX: number; windowScrollY: number }): void;
  adjustTranslateX?: string;
  adjustTranslateY?: string;
  /**
   * Measure this element instead of the layer's own placeholder — right when the layer belongs to an element
   * next to it rather than to the spot it was declared in. The placeholder is a real box: inside a flex row
   * it becomes a flex item, so opening the layer shifts everything after it by one `gap`.
   */
  anchor?: ElementLike;
  /** Which edge of the anchor the layer starts from. Default `'top'`. */
  anchorSide?: 'top' | 'bottom';
  /**
   * Whether the layer takes the measured width of the anchor. Default true, so a dropdown popup
   * lines up with its trigger; a tooltip sizes to its own content and turns it off.
   */
  matchWidth?: boolean;
}

type Props = OverlayProps & BoxProps;

function OverlayImpl(props: Props, ref: Ref<HTMLDivElement>) {
  const {
    onPositionChange,
    adjustTranslateX = '0px',
    adjustTranslateY = '0px',
    anchor,
    anchorSide = 'top',
    matchWidth = true,
    ...restProps
  } = props;

  const positionRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<
    { top: number; left: number; width?: number; windowScrollX: number; windowScrollY: number } | undefined
  >();
  const portalContainer = usePortalContainer();

  const observeScroll = useCallback((element: HTMLElement, callback: (el: HTMLElement) => void) => {
    const listener = (e: Event) => {
      if ((e.target as HTMLElement).contains(element)) {
        callback(element);
      }
    };

    const controller = new AbortController();
    document.addEventListener('scroll', listener, { signal: controller.signal, capture: true });
    return () => controller.abort();
  }, []);

  const observeResize = useCallback((element: HTMLElement, callback: (el: HTMLElement) => void) => {
    const listener = (_e: Event) => {
      callback(element);
    };

    const controller = new AbortController();
    window.addEventListener('resize', listener, { signal: controller.signal, capture: true });
    return () => controller.abort();
  }, []);

  const positionHandler = useCallback(
    (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();

      const edge = anchorSide === 'bottom' ? rect.bottom : rect.top;
      const top = Math.round((edge + window.scrollY) * positionDigitsAfterComma) / positionDigitsAfterComma;
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
    [anchorSide, position, onPositionChange],
  );

  useLayoutEffect(() => {
    const element = htmlElementOf(anchor) ?? positionRef.current;

    if (element) {
      positionHandler(element);
      const scrollHandlerDispose = observeScroll(element, positionHandler);
      const resizeHandlerDispose = observeResize(element, positionHandler);

      return () => {
        scrollHandlerDispose();
        resizeHandlerDispose();
      };
    }
  }, [anchor, positionHandler, observeScroll, observeResize]);

  return (
    <>
      {/* Only when there is nothing else to measure — see `anchor`. */}
      {!anchor && <Box ref={positionRef} />}
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
