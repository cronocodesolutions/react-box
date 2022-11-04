import React, { useState } from 'react';
import classes from './box.module.css';
import { BoxStyles } from './types';
import ClassNameUtils from './utils/className/classNameUtils';

type TagPropsType<TTag extends keyof React.ReactHTML> = Omit<React.ComponentProps<TTag>, 'className' | 'style'>;

interface Props<TTag extends keyof React.ReactHTML> extends BoxStyles {
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
