import React, { forwardRef, Ref, RefAttributes, useMemo, useState } from 'react';
import ClassNameUtils from './utils/className/classNameUtils';
import { DoxStyleProps } from './components/dox/doxStyles';
import useStyles from './components/dox/useStyles';
import { StylesContext } from './components/dox/stylesContext';

type ExtractElementType<T> =
  T extends React.DetailedHTMLProps<React.HTMLAttributes<infer E>, infer E> ? E : T extends React.SVGProps<infer E> ? E : never;

type ExtractElementFromTag<T extends keyof React.JSX.IntrinsicElements> = ExtractElementType<React.JSX.IntrinsicElements[T]>;

type AllProps<TTag extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<TTag>;
type TagPropsType<TTag extends keyof React.JSX.IntrinsicElements> = Omit<AllProps<TTag>, 'className' | 'style' | 'ref'>;

interface Props<TTag extends keyof React.JSX.IntrinsicElements> extends DoxStyleProps {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  className?: ClassNameUtils.ClassNameType;
  style?: React.ComponentProps<TTag>['style'];
}

function Box<TTag extends keyof React.JSX.IntrinsicElements = 'div'>(props: Props<TTag>, ref: Ref<ExtractElementFromTag<TTag>>) {
  const { tag = 'div', children, props: tagProps, className: userClassName, style } = props;

  const styleClasses = useStyles(props, tag === 'svg');
  const className = useMemo(() => {
    const classNames = ClassNameUtils.classNames(userClassName, styleClasses);

    return classNames.join(' ');
  }, [props]);

  const finalTagProps = { ...tagProps, className } as AllProps<TTag>;
  style && (finalTagProps.style = style);
  ref && (finalTagProps.ref = ref as React.RefObject<HTMLElement>);

  const [isHover, setIsHover] = useState(false);
  const needsHoverState = typeof children === 'function';
  if (needsHoverState) {
    finalTagProps.onMouseEnter = () => setIsHover(true);
    finalTagProps.onMouseLeave = () => setIsHover(false);
  }

  return React.createElement(tag, finalTagProps, needsHoverState ? children({ isHover }) : children);
}

export default forwardRef(Box) as <TTag extends keyof React.JSX.IntrinsicElements = 'div'>(
  props: Props<TTag> & RefAttributes<ExtractElementFromTag<TTag>>,
) => React.ReactNode;

const { flush: flushStyles } = StylesContext;

export { flushStyles };
