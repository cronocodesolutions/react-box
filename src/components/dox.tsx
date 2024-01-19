import React, { forwardRef, Ref, RefAttributes, useMemo, useState } from 'react';
import ClassNameUtils from '../utils/className/classNameUtils';
import { DoxStyleProps } from './dox/doxStyles';
import useStyles from './dox/useStyles';

type AllProps<TTag extends keyof JSX.IntrinsicElements> = React.ComponentProps<TTag>;
type TagPropsType<TTag extends keyof JSX.IntrinsicElements> = Omit<AllProps<TTag>, 'className' | 'style' | 'ref'>;

interface Props<TTag extends keyof JSX.IntrinsicElements> extends DoxStyleProps {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  className?: ClassNameUtils.ClassNameType;
  style?: React.ComponentProps<TTag>['style'];
}

function Dox<TTag extends keyof JSX.IntrinsicElements = 'div'>(props: Props<TTag>, ref: Ref<ExtractElementFromTag<TTag>>) {
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

export default forwardRef(Dox) as <TTag extends keyof JSX.IntrinsicElements = 'div'>(
  props: Props<TTag> & RefAttributes<ExtractElementFromTag<TTag>>,
) => JSX.Element;
