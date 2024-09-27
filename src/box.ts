import React, { forwardRef, memo, Ref, RefAttributes, useMemo, useState } from 'react';
import { classNames, ClassNameType } from './core/classNames';
import { BoxStyle, ExtractElementFromTag } from './core/coreTypes';
import { BoxStyleProps } from './types';
import useStyles from './core/useStyles';
import BoxExtends from './core/boxExtends';
import Theme, { ThemeSetup } from './core/theme';

type AllProps<TTag extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<TTag>;
type TagPropsType<TTag extends keyof React.JSX.IntrinsicElements> = Omit<AllProps<TTag>, 'className' | 'style' | 'ref' | 'disabled'>;

interface Props<TTag extends keyof React.JSX.IntrinsicElements> extends BoxStyleProps {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  className?: ClassNameType;
  style?: React.ComponentProps<TTag>['style'];
}

function BoxComponent<TTag extends keyof React.JSX.IntrinsicElements = 'div'>(props: Props<TTag>, ref: Ref<ExtractElementFromTag<TTag>>) {
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

interface BoxType {
  <TTag extends keyof React.JSX.IntrinsicElements = 'div'>(
    props: Props<TTag> & RefAttributes<ExtractElementFromTag<TTag>>,
  ): React.ReactNode;
  extend: <TProps extends Record<string, BoxStyle[]>>(variables: Record<string, string>, props: TProps) => TProps;
  themeSetup: (styles: ThemeSetup) => void;
}

const Box = memo(forwardRef(BoxComponent)) as unknown as BoxType;
// const Box = forwardRef(BoxComponent) as unknown as BoxType;

Box.extend = <TProps extends Record<string, BoxStyle[]>>(variables: Record<string, string>, props: TProps) => {
  BoxExtends.setVariables(variables);
  BoxExtends.setProps(props);

  return props;
};

Box.themeSetup = Theme.setup;

export default Box;

export type BoxProps<TTag extends keyof React.JSX.IntrinsicElements = 'div'> = React.ComponentProps<typeof Box<TTag>>;
export type BoxTagProps<TTag extends keyof React.JSX.IntrinsicElements = 'div'> = Required<BoxProps<TTag>>['props'];
