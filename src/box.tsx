import React, { useState } from 'react';
import classes from './box.module.css';
import { BoxStyles, themeClasses } from './types';
import ClassNameUtils from './utils/className/classNameUtils';

type TagPropsType<TTag extends keyof React.ReactHTML> = Omit<React.ComponentProps<TTag>, 'className' | 'style'>;

interface Props<TTag extends keyof React.ReactHTML> extends BoxStyles {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  style?: React.ComponentProps<TTag>['style'];
  className?: ClassNameUtils.ClassNameType;
}

export default function Box<TTag extends keyof React.ReactHTML = 'div'>(props: Props<TTag>) {
  const { tag, children, props: tagProps, className, style } = props;

  const classNames = className ? ClassNameUtils.classNames(className, classes.box) : [classes.box];
  Object.entries(props).forEach(([key, value]) => {
    const classToAdd = classes[key + value];
    if (classToAdd) {
      classNames.push(classToAdd);
    } else {
      if (themeClasses.includes(key as keyof BoxStyles)) {
        classNames.push(`${key}${value}`);
      }
    }
  });

  const boxTag = tag || 'div';

  const finalTagProps = { ...tagProps, style, className: classNames.join(' ') };

  const [isHover, setIsHover] = useState(false);
  const needsHoverState = typeof children === 'function';
  if (needsHoverState) {
    finalTagProps.onMouseEnter = () => setIsHover(true);
    finalTagProps.onMouseLeave = () => setIsHover(false);
  }

  return React.createElement(boxTag, finalTagProps, needsHoverState ? children({ isHover }) : children);
}
