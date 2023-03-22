import React, { forwardRef, Ref, useState } from 'react';
import classes from './box.module.css';
import { BoxStyles, themeClasses } from './types';
import ClassNameUtils from './utils/className/classNameUtils';

type AllProps<TTag extends keyof React.ReactHTML> = React.ComponentProps<TTag>;
type TagPropsType<TTag extends keyof React.ReactHTML> = Omit<AllProps<TTag>, 'className' | 'style' | 'ref'>;

interface Props<TTag extends keyof React.ReactHTML> extends BoxStyles {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  style?: React.ComponentProps<TTag>['style'];
  className?: ClassNameUtils.ClassNameType;
  ref?: Ref<HTMLElement>;
}

function Box<TTag extends keyof React.ReactHTML = 'div'>(props: Props<TTag>, ref: Ref<HTMLElement>) {
  const { tag, children, props: tagProps, className, style } = props;

  const classNames = className ? ClassNameUtils.classNames(classes.box, className) : [classes.box];
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

  const finalTagProps = { ...tagProps, className: classNames.join(' ') } as AllProps<TTag>;
  style && (finalTagProps.style = style);
  ref && (finalTagProps.ref = ref);

  const [isHover, setIsHover] = useState(false);
  const needsHoverState = typeof children === 'function';
  if (needsHoverState) {
    finalTagProps.onMouseEnter = () => setIsHover(true);
    finalTagProps.onMouseLeave = () => setIsHover(false);
  }

  return React.createElement(tag || 'div', finalTagProps, needsHoverState ? children({ isHover }) : children);
}

export default forwardRef(Box) as <TTag extends keyof React.ReactHTML = 'div'>(props: Props<TTag>) => JSX.Element;
