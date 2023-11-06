import React, { forwardRef, Ref, useMemo, useState } from 'react';
import classes from './box.module.css';
import { BoxStyles, themeClasses } from './types';
import ClassNameUtils from './utils/className/classNameUtils';
import { ThemeComponentProps, useTheme } from './theme';

type AllProps<TTag extends keyof React.ReactHTML> = React.ComponentProps<TTag>;
type TagPropsType<TTag extends keyof React.ReactHTML> = Omit<AllProps<TTag>, 'className' | 'style' | 'ref'>;

interface Props<TTag extends keyof React.ReactHTML> extends BoxStyles, ThemeComponentProps {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  style?: React.ComponentProps<TTag>['style'];
  className?: ClassNameUtils.ClassNameType;
  ref?: Ref<HTMLElement>;
}

function Box<TTag extends keyof React.ReactHTML = 'div'>(props: Props<TTag>, ref: Ref<HTMLElement>) {
  const { tag, children, props: tagProps, className: userClassName, style } = props;

  const themeStyles = useTheme(props);
  const className = useMemo(() => {
    const classNames = userClassName ? ClassNameUtils.classNames(classes.box, userClassName) : [classes.box];
    const newProps = { ...themeStyles, ...props };

    Object.entries(newProps).forEach(([key, value]) => {
      const classToAdd = classes[key + value];
      if (classToAdd) {
        classNames.push(classToAdd);
      } else {
        if (key in themeClasses) {
          classNames.push(`${themeClasses[key as keyof BoxStyles]}${value}`);
        }
      }
    });

    return classNames.join(' ');
  }, [props]);

  const finalTagProps = { ...tagProps, className } as AllProps<TTag>;
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
