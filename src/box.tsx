import React, { useState } from 'react';
import classes from './box.module.css';
import { SizeType, ColorType, CursorType, FontSizeType } from './css.variables';
import ClassNameUtils from './utils/className/classNameUtils';

interface BoxDisplay {
  display?: 'none' | 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid';
  inline?: boolean;
}

interface BoxPosition {
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  inset?: SizeType;
  top?: SizeType;
  right?: SizeType;
  bottom?: SizeType;
  left?: SizeType;
}

type BoxSizeValue = 'fit' | 'fit-screen' | 'auto' | 'fit-content' | 'max-content' | 'min-content';
interface BoxSize {
  width?: BoxSizeValue;
  height?: BoxSizeValue;
  minWidth?: BoxSizeValue;
  minHeight?: BoxSizeValue;
  maxWidth?: BoxSizeValue;
  maxHeight?: BoxSizeValue;
}

interface BoxMargin {
  margin?: SizeType | 'auto';
  m?: SizeType | 'auto';
  marginHorizontal?: SizeType | 'auto';
  mx?: SizeType | 'auto';
  marginVertical?: SizeType | 'auto';
  my?: SizeType | 'auto';
  marginTop?: SizeType | 'auto';
  mt?: SizeType | 'auto';
  marginRight?: SizeType | 'auto';
  mr?: SizeType | 'auto';
  marginBottom?: SizeType | 'auto';
  mb?: SizeType | 'auto';
  marginLeft?: SizeType | 'auto';
  ml?: SizeType | 'auto';
}

interface BoxBorder {
  border?: SizeType;
  b?: SizeType;
  borderHorizontal?: SizeType;
  bx?: SizeType;
  borderVertical?: SizeType;
  by?: SizeType;
  borderTop?: SizeType;
  bt?: SizeType;
  borderRight?: SizeType;
  br?: SizeType;
  borderBottom?: SizeType;
  bb?: SizeType;
  borderLeft?: SizeType;
  bl?: SizeType;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  bStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  borderRadius?: SizeType;
  bRadius?: SizeType;
  borderRadiusTop?: SizeType;
  bRadiusTop?: SizeType;
  borderRadiusRight?: SizeType;
  bRadiusRight?: SizeType;
  borderRadiusBottom?: SizeType;
  bRadiusBottom?: SizeType;
  borderRadiusLeft?: SizeType;
  bRadiusLeft?: SizeType;
  borderRadiusTopLeft?: SizeType;
  bRadiusTopLeft?: SizeType;
  borderRadiusTopRight?: SizeType;
  bRadiusTopRight?: SizeType;
  borderRadiusBottomLeft?: SizeType;
  bRadiusBottomLeft?: SizeType;
  borderRadiusBottomRight?: SizeType;
  bRadiusBottomRight?: SizeType;
}

interface BoxPadding {
  padding?: SizeType;
  p?: SizeType;
  paddingHorizontal?: SizeType;
  px?: SizeType;
  paddingVertical?: SizeType;
  py?: SizeType;
  paddingTop?: SizeType;
  pt?: SizeType;
  paddingRight?: SizeType;
  pr?: SizeType;
  paddingBottom?: SizeType;
  pb?: SizeType;
  paddingLeft?: SizeType;
  pl?: SizeType;
}

interface BoxColors {
  color?: ColorType;
  colorHover?: ColorType;
  backgroundColor?: ColorType;
  bgColor?: ColorType;
  backgroundColorHover?: ColorType;
  bgColorHover?: ColorType;
  borderColor?: ColorType;
  bColor?: ColorType;
  borderColorHover?: ColorType;
  bColorHover?: ColorType;
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
  lineHeight?: FontSizeType;
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  letterSpacing?: SizeType;
}

interface BoxText {
  textDecoration?: 'none' | 'underline';
  textTransform?: 'none' | 'capitalize' | 'lowercase' | 'uppercase';
  textAlign?: 'left' | 'right' | 'center';
}

interface BoxFlex {
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?:
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'left'
    | 'right'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'start' | 'end' | 'self-start' | 'self-end';
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch'
    | 'start'
    | 'end'
    | 'baseline';
  flex1?: boolean;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  gap?: SizeType;
  rowGap?: SizeType;
  columnGap?: SizeType;
  order?: SizeType;
  flexGrow?: SizeType;
  flexShrink?: SizeType;
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justifySelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

interface BoxHover {
  hover?: boolean;
}

type BoxStyles = BoxDisplay &
  BoxPosition &
  BoxSize &
  BoxMargin &
  BoxBorder &
  BoxPadding &
  BoxColors &
  BoxCursor &
  BoxZIndex &
  BoxOverflow &
  BoxOpacity &
  BoxFont &
  BoxText &
  BoxFlex &
  BoxHover;

type TagPropsType<TTag extends keyof React.ReactHTML> = Omit<React.ComponentProps<TTag>, 'className' | 'style'>;

interface Props<TTag extends keyof React.ReactHTML> extends BoxStyles, Hovered<BoxStyles> {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  styles?: React.ComponentProps<TTag>['style'];
  className?: ClassNameUtils.ClassNameType;
}

export default function Box<TTag extends keyof React.ReactHTML = 'div'>(props: Props<TTag>) {
  const { tag, children, props: tagProps, className, styles } = props;

  const classNames = className ? ClassNameUtils.classNames(className, classes.box) : [classes.box];
  Object.entries(props).forEach(([key, value]) => {
    const classToAdd = classes[key + value];
    classToAdd && classNames.push(classToAdd);
  });

  const boxTag = tag || 'div';

  const finalTagProps = { ...tagProps, style: styles, className: classNames.join(' ') };

  const [isHover, setIsHover] = useState(false);
  const needsHoverState = typeof children === 'function';
  if (needsHoverState) {
    finalTagProps.onMouseEnter = () => setIsHover(true);
    finalTagProps.onMouseLeave = () => setIsHover(false);
  }

  return React.createElement(boxTag, finalTagProps, needsHoverState ? children({ isHover }) : children);
}
