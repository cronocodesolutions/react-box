import React, { useState } from 'react';
import { ColorType, Hovered } from '../../types';
import ClassNameUtils from '../../utils/className/classNameUtils';
import classes from './baseSvg.module.css';

interface SvgNormalStyles {
  fill?: ColorType | string;
  stroke?: ColorType | string;
  rotate?: 0 | 90 | 180 | 270;
  flip?: 'xAxis' | 'yAxis';
}
export type SvgStyles = SvgNormalStyles & Hovered<SvgNormalStyles>;

type AllSvgProps = React.SVGProps<SVGElement>;
type SvgPropsType = Omit<AllSvgProps, 'className' | 'style' | 'width' | 'height'>;
type SvgStyleType = Omit<React.CSSProperties, 'width' | 'height'>;

const customThemeClasses: Array<keyof SvgStyles> = ['fill', 'fillH', 'stroke', 'strokeH'];

interface Props extends SvgStyles {
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
      if (customThemeClasses.includes(key as keyof SvgStyles)) {
        classNames.push(`${key}${value}`);
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
