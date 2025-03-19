import React, { forwardRef, memo, Ref, RefAttributes, useMemo, useState } from 'react';
import { classNames, ClassNameType } from './core/classNames';
import { ExtractElementFromTag } from './core/coreTypes';
import { BoxStyleProps, ComponentsAndVariants } from './types';
import useStyles from './core/useStyles';
import BoxExtends from './core/extends/boxExtends';
import Theme from './core/theme/theme';
import Variables from './core/variables';
import BoxUtils from './utils/box/boxUtils';
import './array';

type AllProps<TTag extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<TTag>;
type TagPropsType<TTag extends keyof React.JSX.IntrinsicElements> = Omit<
  AllProps<TTag>,
  'className' | 'style' | 'ref' | 'disabled' | 'required' | 'checked'
>;

interface Props<TTag extends keyof React.JSX.IntrinsicElements, TKey extends keyof ComponentsAndVariants> extends BoxStyleProps<TKey> {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  className?: ClassNameType;
  style?: React.ComponentProps<TTag>['style'];
}

function BoxComponent<TTag extends keyof React.JSX.IntrinsicElements = 'div', TKey extends keyof ComponentsAndVariants = never>(
  props: Props<TTag, TKey>,
  ref: Ref<ExtractElementFromTag<TTag>>,
) {
  const { tag = 'div', children, props: tagProps, className: userClassName, style, disabled, required, checked, selected } = props;

  const styleClasses = useStyles(props, tag === 'svg');

  const finalTagProps = useMemo(() => {
    const className = classNames(styleClasses, userClassName).join(' ');
    const props = {
      ...tagProps,
      className,
    } as AllProps<TTag>;
    BoxUtils.assignBooleanProp(disabled, 'disabled', props);
    BoxUtils.assignBooleanProp(required, 'required', props);
    BoxUtils.assignBooleanProp(checked, 'checked', props);
    BoxUtils.assignBooleanProp(selected, 'selected', props);
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
  <TTag extends keyof React.JSX.IntrinsicElements = 'div', TKey extends keyof ComponentsAndVariants = never>(
    props: Props<TTag, TKey> & RefAttributes<ExtractElementFromTag<TTag>>,
  ): React.ReactNode;
  extend: typeof BoxExtends.extend;
  components: typeof BoxExtends.components;
  Theme: typeof Theme;
  useTheme: typeof Theme.useTheme;
  getVariableValue: typeof Variables.getVariableValue;
}

const Box = memo(forwardRef(BoxComponent)) as unknown as BoxType;
// const Box = forwardRef(BoxComponent) as unknown as BoxType;

Box.extend = BoxExtends.extend;
Box.components = BoxExtends.components;
Box.Theme = Theme;
Box.useTheme = Theme.useTheme;
Box.getVariableValue = Variables.getVariableValue;

export default Box;

export type BoxProps<
  TTag extends keyof React.JSX.IntrinsicElements = 'div',
  TKey extends keyof ComponentsAndVariants = never,
> = React.ComponentProps<typeof Box<TTag, TKey>>;
export type BoxTagProps<
  TTag extends keyof React.JSX.IntrinsicElements = 'div',
  TKey extends keyof ComponentsAndVariants = never,
> = Required<BoxProps<TTag, TKey>>['props'];
