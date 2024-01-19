import { forwardRef, Ref } from 'react';
import Dox from './dox';
import ClassNameUtils from '../utils/className/classNameUtils';
import { DoxSvgStyles } from './dox/doxStyles';

type SvgTagProps = Required<React.ComponentProps<typeof Dox<'svg'>>>['props'];
type DoxSvgTagProps = Omit<SvgTagProps, 'viewBox' | 'width' | 'height'>;

interface Props extends DoxSvgStyles {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  props?: DoxSvgTagProps;
  style?: React.ComponentProps<'svg'>['style'];
  className?: ClassNameUtils.ClassNameType;
  viewBox?: string;
  width?: string;
  height?: string;
}

function DoxSvg(props: Props, ref: Ref<SVGSVGElement>) {
  const { viewBox = '0 0 24 24', width = '1.5rem', height, props: tagProps, ...restProps } = props;

  return (
    <Dox
      tag="svg"
      ref={ref}
      props={{ ...tagProps, viewBox, width, height, xmlns: 'http://www.w3.org/2000/svg', fill: 'none' }}
      {...restProps}
    />
  );
}

export default forwardRef(DoxSvg);
