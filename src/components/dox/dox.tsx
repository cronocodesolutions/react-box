import React, { forwardRef, Ref, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import ClassNameUtils from '../../utils/className/classNameUtils';
import { DoxStyleProps } from './doxStyles';
import useStyles from './useStyles';

type AllProps<TTag extends keyof React.ReactHTML> = React.ComponentProps<TTag>;
type TagPropsType<TTag extends keyof React.ReactHTML> = Omit<AllProps<TTag>, 'className' | 'style' | 'ref'>;

interface Props<TTag extends keyof React.ReactHTML> extends DoxStyleProps {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  tag?: TTag;
  props?: TagPropsType<TTag>;
  className?: ClassNameUtils.ClassNameType;
}

function Dox<TTag extends keyof React.ReactHTML = 'div'>(props: Props<TTag>, ref: Ref<HTMLElement>) {
  const { tag, children, props: tagProps, className: userClassName } = props;

  const styleClasses = useStyles(props);
  const className = useMemo(() => {
    const classNames = ClassNameUtils.classNames(userClassName, styleClasses);

    return classNames.join(' ');
  }, [props]);

  const finalTagProps = { ...tagProps, className } as AllProps<TTag>;
  ref && (finalTagProps.ref = ref);

  const [isHover, setIsHover] = useState(false);
  const needsHoverState = typeof children === 'function';
  if (needsHoverState) {
    finalTagProps.onMouseEnter = () => setIsHover(true);
    finalTagProps.onMouseLeave = () => setIsHover(false);
  }

  return React.createElement(tag || 'div', finalTagProps, needsHoverState ? children({ isHover }) : children);
}

export default forwardRef(Dox) as <TTag extends keyof React.ReactHTML = 'div'>(props: Props<TTag>) => JSX.Element;
