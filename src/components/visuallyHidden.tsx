import { forwardRef, Ref, RefAttributes } from 'react';
import Box, { BoxProps } from '../box';
import { ExtractElementFromTag } from '../react/reactTypes';
import { ComponentsAndVariants } from '../types';

/**
 * The engine's length scale is rem/4, so `0.25` is `0.0625rem` — one pixel at the default root
 * font size. Not zero: a zero-sized element is skipped by some screen readers, and a zero-sized
 * focusable one cannot be scrolled to when it takes focus.
 */
const ONE_PIXEL = 0.25;

/**
 * Content for screen readers that is not drawn on screen.
 *
 * `display: none` and `hidden` remove content from the accessibility tree along with the layout,
 * which is the opposite of what is wanted here: the name of an icon-only button, the heading a
 * region is labelled by, a live region's announcement. This clips the element to nothing instead,
 * leaving it in the tree and in the tab order.
 *
 * Every part of the recipe earns its place: `position: absolute` keeps it out of the layout,
 * one pixel with `overflow: hidden` and `clip-path: inset(50%)` leaves nothing to see, and
 * `white-space: nowrap` stops a long string from being wrapped into a one-pixel-wide column, which
 * some browsers report to assistive technology as one word per line.
 *
 * Props override the defaults, so `<VisuallyHidden tag="span">` and a `component` style tree both
 * work as they would on any Box.
 */
function VisuallyHiddenImpl<TTag extends keyof React.JSX.IntrinsicElements = 'div'>(
  props: BoxProps<TTag>,
  ref: Ref<ExtractElementFromTag<TTag>>,
) {
  return (
    <Box
      ref={ref}
      position="absolute"
      width={ONE_PIXEL}
      height={ONE_PIXEL}
      p={0}
      b={0}
      overflow="hidden"
      whiteSpace="nowrap"
      clipPath="inset(50%)"
      {...props}
    />
  );
}

const VisuallyHidden = forwardRef(VisuallyHiddenImpl);
VisuallyHidden.displayName = 'VisuallyHidden';

export default VisuallyHidden as <TTag extends keyof React.JSX.IntrinsicElements = 'div', TKey extends keyof ComponentsAndVariants = never>(
  props: BoxProps<TTag, TKey> & RefAttributes<ExtractElementFromTag<TTag>>,
) => React.ReactNode;
