import React, { useState } from 'react';
import { Activated, Focused, Hovered, themeSvgClasses, SvgStyles } from '../../types';
import ClassNameUtils from '../../utils/className/classNameUtils';
import classes from './baseSvg.module.css';

type AllSvgProps = React.SVGProps<SVGElement>;
type SvgPropsType = Omit<AllSvgProps, 'className' | 'style' | 'width' | 'height'>;
type SvgStyleType = Omit<React.CSSProperties, 'width' | 'height'>;

export namespace Augmented {
  export interface Props {}
}

interface Props extends SvgStyles, Augmented.Props {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  props?: SvgPropsType;
  style?: SvgStyleType;
  className?: ClassNameUtils.ClassNameType;
  viewBox?: string;
  width?: string;
  height?: string;
}

export default function BaseSvg(props: Props) {
  const { children, props: tagProps, className, style, viewBox, width, height } = props;

  const classNames = className ? ClassNameUtils.classNames(className, classes.base) : [classes.base];
  Object.entries(props).forEach(([key, value]) => {
    const classToAdd = classes[key + value];
    if (classToAdd) {
      classNames.push(classToAdd);
    } else {
      if (key in themeSvgClasses) {
        classNames.push(`${themeSvgClasses[key]}${value}`);
      }
    }
  });

  const finalTagProps = {
    ...tagProps,
    style: { ...style, width, height },
    className: classNames.join(' '),
    viewBox: viewBox || '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
  };

  const [isHover, setIsHover] = useState(false);
  const needsHoverState = typeof children === 'function';
  if (needsHoverState) {
    finalTagProps.onMouseEnter = () => setIsHover(true);
    finalTagProps.onMouseLeave = () => setIsHover(false);
  }

  return React.createElement('svg', finalTagProps, needsHoverState ? children({ isHover }) : children);
}
