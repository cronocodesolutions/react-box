import React, { useState } from 'react';
import classes from './box.module.css';
import { SizeType, ColorType, CursorType, FontSizeType } from './css.variables';

interface BoxDisplay {
  display?: 'none' | 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid';
}

interface BoxPosition {
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: SizeType;
  right?: SizeType;
  bottom?: SizeType;
  left?: SizeType;
}

interface BoxMargin {
  m?: SizeType;
  mx?: SizeType;
  my?: SizeType;
  mt?: SizeType;
  mr?: SizeType;
  mb?: SizeType;
  ml?: SizeType;
}

interface BoxBorder {
  b?: SizeType;
  bx?: SizeType;
  by?: SizeType;
  bt?: SizeType;
  br?: SizeType;
  bb?: SizeType;
  bl?: SizeType;
  bStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  bRadius?: SizeType;
  bRadiusTop?: SizeType;
  bRadiusRight?: SizeType;
  bRadiusBottom?: SizeType;
  bRadiusLeft?: SizeType;
  bRadiusTopLeft?: SizeType;
  bRadiusTopRight?: SizeType;
  bRadiusBottomLeft?: SizeType;
  bRadiusBottomRight?: SizeType;
}

interface BoxPadding {
  p?: SizeType;
  px?: SizeType;
  py?: SizeType;
  pt?: SizeType;
  pr?: SizeType;
  pb?: SizeType;
  pl?: SizeType;
}

interface BoxColors {
  color?: ColorType;
  colorHover?: ColorType;
  bgColor?: ColorType;
  bgColorHover?: ColorType;
  bColor?: ColorType;
  bColorHover?: ColorType;
}

interface BoxLineHeightSize {
  lineHeight?: SizeType;
}

interface BoxCursor {
  cursor?: CursorType;
}

interface BoxZIndex {
  zIndex?: SizeType;
}

interface BoxOverflow {
  overflow?: 'auto' | 'hidden' | 'scroll' | 'visible';
  overflowX?: 'auto' | 'hidden' | 'scroll' | 'visible';
  overflowY?: 'auto' | 'hidden' | 'scroll' | 'visible';
}

interface BoxOpacity {
  opacity?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
}

interface BoxFont {
  fontSize?: FontSizeType;
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

interface BoxText {
  textDecoration?: 'none' | 'underline';
  textAlign?: 'left' | 'right' | 'center';
}

interface Props<TTag extends keyof React.ReactHTML>
  extends BoxDisplay,
    BoxPosition,
    BoxMargin,
    BoxBorder,
    BoxPadding,
    BoxColors,
    BoxLineHeightSize,
    BoxCursor,
    BoxZIndex,
    BoxOverflow,
    BoxOpacity,
    BoxFont,
    BoxText {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: React.ComponentProps<TTag>;
}

export default function Box<TTag extends keyof React.ReactHTML = 'div'>(boxProps: Props<TTag>) {
  const { tag, children, props } = boxProps;

  const classNames = [classes.box];
  Object.entries(boxProps).forEach(([key, value]) => {
    const classToAdd = classes[key + value];
    classToAdd && classNames.push(classToAdd);
  });

  const boxTag = tag || 'div';
  const tagProps = { ...props, className: classNames.join(' ') };

  const [isHover, setIsHover] = useState(false);
  const needsHoverState = typeof children === 'function';
  if (needsHoverState) {
    tagProps.onMouseEnter = () => setIsHover(true);
    tagProps.onMouseLeave = () => setIsHover(false);
  }

  return React.createElement(boxTag, tagProps, needsHoverState ? children({ isHover }) : children);
}
