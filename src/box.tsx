import React, { useState } from 'react';
import classes from './box.module.css';
import { SizeType } from './css.variables';

interface BoxMargin {
  m?: SizeType;
  mx?: SizeType;
  my?: SizeType;
  mt?: SizeType;
  mr?: SizeType;
  mb?: SizeType;
  ml?: SizeType;
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

interface Props<TTag extends keyof React.ReactHTML> extends BoxMargin, BoxPadding {
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
