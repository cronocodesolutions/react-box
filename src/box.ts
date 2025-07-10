import React, { forwardRef, memo, Ref, RefAttributes, useMemo, useState } from 'react';
import { classNames, ClassNameType } from './core/classNames';
import { ExtractElementFromTag } from './core/coreTypes';
import BoxExtends from './core/extends/boxExtends';
import Theme from './core/theme/theme';
import useStyles from './core/useStyles';
import Variables from './core/variables';
import './array';
import useVisibility from './hooks/useVisibility';
import { BoxStyleProps, ComponentsAndVariants } from './types';
import BoxUtils from './utils/box/boxUtils';

type AllProps<TTag extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<TTag>;
type TagPropsType<TTag extends keyof React.JSX.IntrinsicElements> = Omit<
  AllProps<TTag>,
  'className' | 'style' | 'ref' | 'disabled' | 'required' | 'checked' | 'id'
>;

interface Props<TTag extends keyof React.JSX.IntrinsicElements, TKey extends keyof ComponentsAndVariants> extends BoxStyleProps<TKey> {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  /** html tag element */
  tag?: TTag;
  /** props (attributes) related to html tag */
  props?: TagPropsType<TTag>;
  /** classNames. supports conditional classNames. */
  className?: ClassNameType;
  /** CSSProperties */
  style?: React.ComponentProps<TTag>['style'];
  /** The HTML id attribute is used to specify a unique id for an HTML element. */
  id?: string;
}

function BoxComponent<TTag extends keyof React.JSX.IntrinsicElements = 'div', TKey extends keyof ComponentsAndVariants = never>(
  props: Props<TTag, TKey>,
  ref: Ref<ExtractElementFromTag<TTag>>,
) {
  const { tag = 'div', children, props: tagProps, className: userClassName, disabled, required, checked, selected } = props;

  const styleClasses = useStyles(props, tag === 'svg');

  const finalTagProps = useMemo(() => {
    const className = classNames(styleClasses, userClassName).join(' ');
    const propsToUse = {
      ...tagProps,
      className,
    } as AllProps<TTag>;
    BoxUtils.assignBooleanProp(disabled, 'disabled', propsToUse);
    BoxUtils.assignBooleanProp(required, 'required', propsToUse);
    BoxUtils.assignBooleanProp(checked, 'checked', propsToUse);
    BoxUtils.assignBooleanProp(selected, 'selected', propsToUse);
    'style' in props && (propsToUse.style = props.style);
    'id' in props && (propsToUse.id = props.id);
    ref && (propsToUse.ref = ref as React.RefObject<HTMLElement>);

    return propsToUse;
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

(Box as React.FunctionComponent).displayName = 'Box';
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

export { useVisibility };
