import React, { forwardRef, Ref, RefAttributes, useMemo, useState } from 'react';
import { ExtractElementFromTag } from './core/types';
import { classNames, ClassNameType } from './core/classNames';
import { BoxStyles, useStyles } from './core/boxStyles2';

type AllProps<TTag extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<TTag>;
type TagPropsType<TTag extends keyof React.JSX.IntrinsicElements> = Omit<AllProps<TTag>, 'className' | 'style' | 'ref' | 'disabled'>;

interface Props<TTag extends keyof React.JSX.IntrinsicElements> extends BoxStyles {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  className?: ClassNameType;
  style?: React.ComponentProps<TTag>['style'];
}

function Box2<TTag extends keyof React.JSX.IntrinsicElements = 'div'>(props: Props<TTag>, ref: Ref<ExtractElementFromTag<TTag>>) {
  const { tag = 'div', children, props: tagProps, className: userClassName, style, disabled } = props;

  const styleClasses = useStyles(props, tag === 'svg');

  const finalTagProps = useMemo(() => {
    const className = classNames(styleClasses, userClassName).join(' ');
    const props = { ...tagProps, className, disabled: Array.isArray(disabled) ? disabled[0] : disabled } as AllProps<TTag>;
    style && (props.style = style);
    ref && (props.ref = ref as React.RefObject<HTMLElement>);

    return props;
  }, [props]);

  const [isHover, setIsHover] = useState(false);
  const needsHoverState = typeof children === 'function';
  if (needsHoverState) {
    finalTagProps.onMouseEnter = () => setIsHover(true);
    finalTagProps.onMouseLeave = () => setIsHover(false);
  }

  return React.createElement(tag, finalTagProps, needsHoverState ? children({ isHover }) : children);
}

export default forwardRef(Box2) as <TTag extends keyof React.JSX.IntrinsicElements = 'div'>(
  props: Props<TTag> & RefAttributes<ExtractElementFromTag<TTag>>,
) => React.ReactNode;

export type BoxProps<TTag extends keyof React.JSX.IntrinsicElements = 'div'> = React.ComponentProps<typeof Box2<TTag>>;
export type BoxTagProps<TTag extends keyof React.JSX.IntrinsicElements = 'div'> = Required<BoxProps<TTag>>['props'];
