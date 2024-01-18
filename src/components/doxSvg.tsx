import React from 'react';
import Dox from './dox';
import ClassNameUtils from '../utils/className/classNameUtils';
import { DoxSvgStyles } from './dox/doxStyles';

type AllSvgProps = React.SVGProps<SVGElement>;
type SvgPropsType = Omit<AllSvgProps, 'className' | 'style' | 'width' | 'height'>;
type SvgStyleType = Omit<React.CSSProperties, 'width' | 'height'>;

interface Props extends DoxSvgStyles {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  props?: SvgPropsType;
  style?: SvgStyleType;
  className?: ClassNameUtils.ClassNameType;
  viewBox?: string;
  width?: string;
  height?: string;
}

export default function DoxSvg(props: Props) {
  const { props: tagProps, style, width, height, viewBox = '0 0 24 24', className } = props;

  return (
    <Dox
      tag="svg"
      className={className}
      {...(props as React.ComponentProps<typeof Dox<'svg'>>)}
      props={{ ...tagProps, viewBox, xmlns: 'http://www.w3.org/2000/svg', fill: 'none' }}
      style={{ ...style, width, height }}
    />
  );
}
