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
    const newProps = themeStyles ? { ...replaceAliases(themeStyles), ...replaceAliases(props) } : replaceAliases(props);

    Object.entries(newProps).forEach(([key, value]) => {
      const classToAdd = classes[(key as string) + value];
      if (classToAdd) {
        classNames.push(classToAdd);
      } else {
        if ((key as keyof BoxStyles) in themeClasses) {
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

const aliases: Partial<Record<keyof BoxStyles, keyof BoxStyles>> = {
  m: 'margin',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  p: 'padding',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  b: 'border',
  bx: 'borderHorizontal',
  by: 'borderVertical',
  bt: 'borderTop',
  br: 'borderRight',
  bb: 'borderBottom',
  bl: 'borderLeft',
  jc: 'justifyContent',
  ai: 'alignItems',
  ac: 'alignContent',
  d: 'flexDirection',
};

const aliasesToUse: Partial<Record<keyof BoxStyles, keyof BoxStyles>> = Object.entries(aliases).reduce((acc, [alias, property]) => {
  acc[alias as keyof BoxStyles] = property;
  acc[`${alias}H` as keyof BoxStyles] = `${property}H` as keyof BoxStyles;
  acc[`${alias}F` as keyof BoxStyles] = `${property}F` as keyof BoxStyles;
  acc[`${alias}A` as keyof BoxStyles] = `${property}A` as keyof BoxStyles;

  return acc;
}, {} as Partial<Record<keyof BoxStyles, keyof BoxStyles>>);

function replaceAliases(props: BoxStyles) {
  const newProps: BoxStyles = { ...props };
  const keys = Object.keys(newProps) as (keyof BoxStyles)[];

  keys.forEach((key) => {
    const mainPropKey = aliasesToUse[key];
    if (mainPropKey) {
      //
      if (mainPropKey in newProps === false) {
        (newProps[mainPropKey] as any) = newProps[key];
      }

      delete newProps[key];
    }
  });

  return newProps;
}
