import React, { forwardRef, Ref, RefAttributes, useMemo, useState } from 'react';
import { BoxStyleProps, ExtractElementFromTag } from './core/types';
import useStyles from './core/useStyles';
import { classNames, ClassNameType } from './core/classNames';

type AllProps<TTag extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<TTag>;
type TagPropsType<TTag extends keyof React.JSX.IntrinsicElements> = Omit<AllProps<TTag>, 'className' | 'style' | 'ref' | 'disabled'>;

interface Props<TTag extends keyof React.JSX.IntrinsicElements> extends BoxStyleProps {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  className?: ClassNameType;
  style?: React.ComponentProps<TTag>['style'];
}

function Box<TTag extends keyof React.JSX.IntrinsicElements = 'div'>(props: Props<TTag>, ref: Ref<ExtractElementFromTag<TTag>>) {
  const { tag = 'div', children, props: tagProps, className: userClassName, style, disabled } = props;

  const styleClasses = useStyles(props, tag === 'svg');
  const className = useMemo(() => classNames(styleClasses, userClassName).join(' '), [props]);

  const finalTagProps = { ...tagProps, className, disabled: Array.isArray(disabled) ? disabled[0] : disabled } as AllProps<TTag>;
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

export type BoxProps<TTag extends keyof React.JSX.IntrinsicElements = 'div'> = React.ComponentProps<typeof Box<TTag>>;
export type BoxTagProps<TTag extends keyof React.JSX.IntrinsicElements = 'div'> = Required<BoxProps<TTag>>['props'];
