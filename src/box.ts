import React, { forwardRef, memo, Ref, RefAttributes, useMemo, useState } from 'react';
import { classNames, ClassNameType } from './core/classNames';
import { ExtractElementFromTag } from './core/coreTypes';
import { BoxStyleProps } from './types';
import useStyles from './core/useStyles';
import BoxExtends from './core/boxExtends';
import Theme from './core/theme';

type AllProps<TTag extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<TTag>;
type TagPropsType<TTag extends keyof React.JSX.IntrinsicElements> = Omit<
  AllProps<TTag>,
  'className' | 'style' | 'ref' | 'disabled' | 'required' | 'checked'
>;

interface Props<TTag extends keyof React.JSX.IntrinsicElements> extends BoxStyleProps {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  className?: ClassNameType;
  style?: React.ComponentProps<TTag>['style'];
}

function BoxComponent<TTag extends keyof React.JSX.IntrinsicElements = 'div'>(props: Props<TTag>, ref: Ref<ExtractElementFromTag<TTag>>) {
  const { tag = 'div', children, props: tagProps, className: userClassName, style, disabled, required, checked } = props;

  const styleClasses = useStyles(props, tag === 'svg');

  const finalTagProps = useMemo(() => {
    const className = classNames(styleClasses, userClassName).join(' ');
    const props = {
      ...tagProps,
      className,
    } as AllProps<TTag>;
    disabled ? ((props as any).disabled = Array.isArray(disabled) ? disabled[0] : disabled) : 1;
    required ? ((props as any).required = Array.isArray(required) ? required[0] : required) : 1;
    checked ? ((props as any).checked = Array.isArray(checked) ? checked[0] : checked) : 1;
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

interface BoxType {
  <TTag extends keyof React.JSX.IntrinsicElements = 'div'>(
    props: Props<TTag> & RefAttributes<ExtractElementFromTag<TTag>>,
  ): React.ReactNode;
  extend: typeof BoxExtends.extend;
  themeSetup: typeof Theme.setup;
}

const Box = memo(forwardRef(BoxComponent)) as unknown as BoxType;
// const Box = forwardRef(BoxComponent) as unknown as BoxType;

Box.extend = BoxExtends.extend;
Box.themeSetup = Theme.setup;

export default Box;

export type BoxProps<TTag extends keyof React.JSX.IntrinsicElements = 'div'> = React.ComponentProps<typeof Box<TTag>>;
export type BoxTagProps<TTag extends keyof React.JSX.IntrinsicElements = 'div'> = Required<BoxProps<TTag>>['props'];
