import React, { forwardRef, memo, Ref, RefAttributes, useMemo, useState } from 'react';
import getDefaultEngine from './core/engine/defaultEngine';
import BoxExtends from './core/extends/boxExtends';
import { BoxCoreProps } from './react/boxProps';
import buildTagProps from './react/boxTagProps';
import useVisibility from './react/hooks/useVisibility';
import { ExtractElementFromTag } from './react/reactTypes';
import Theme from './react/theme/theme';
import useStyles, { StylesContext } from './react/useStyles';
import { ComponentsAndVariants } from './types';

function BoxComponent<TTag extends keyof React.JSX.IntrinsicElements = 'div', TKey extends keyof ComponentsAndVariants = never>(
  props: BoxCoreProps<TTag, TKey>,
  ref: Ref<ExtractElementFromTag<TTag>>,
) {
  const { tag = 'div', children } = props;

  const { classNames: styleClasses, styleElements } = useStyles(props, tag === 'svg');

  const finalTagProps = useMemo(() => {
    const propsToUse = buildTagProps(props, styleClasses);
    ref && (propsToUse.ref = ref as React.RefObject<HTMLElement>);

    return propsToUse as React.ComponentProps<TTag>;
    // Intentionally keyed on the whole props object — Box is memoized, so props is referentially
    // stable unless something actually changed, and all derived values come from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const [isHover, setIsHover] = useState(false);
  const needsHoverState = typeof children === 'function';
  const elementProps = needsHoverState
    ? { ...finalTagProps, onMouseEnter: () => setIsHover(true), onMouseLeave: () => setIsHover(false) }
    : finalTagProps;

  const element = React.createElement(tag, elementProps, needsHoverState ? children({ isHover }) : children);

  // Element mode: the CSS travels with the markup. The style elements are siblings rather than
  // children — a void tag (`input`, `img`) cannot have children — and React 19 hoists them out of
  // the tree into `<head>` anyway, so nothing of them is left where they were rendered.
  return styleElements ? React.createElement(React.Fragment, null, styleElements, element) : element;
}

interface BoxType {
  <TTag extends keyof React.JSX.IntrinsicElements = 'div', TKey extends keyof ComponentsAndVariants = never>(
    props: BoxCoreProps<TTag, TKey> & RefAttributes<ExtractElementFromTag<TTag>>,
  ): React.ReactNode;
  extend: typeof BoxExtends.extend;
  components: typeof BoxExtends.components;
  Theme: typeof Theme;
  useTheme: typeof Theme.useTheme;
  getVariableValue: (name: string) => string;
  /** Explicit engine configuration (class-name hashing, style sink). Call once, before the first render. */
  configure: typeof StylesContext.configure;
}

const Box = memo(forwardRef(BoxComponent)) as unknown as BoxType;

(Box as React.FunctionComponent).displayName = 'Box';
Box.extend = BoxExtends.extend;
Box.components = BoxExtends.components;
Box.Theme = Theme;
Box.useTheme = Theme.useTheme;
Box.getVariableValue = (name: string) => getDefaultEngine().getVariableValue(name);
Box.configure = StylesContext.configure;

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
