import { forwardRef, Ref } from 'react';
import Box, { BoxTagProps } from '../box';
import { ClassNameType } from '../core/classNames';
import { BoxStyleProps } from '../types';

type BoxSvgTagProps = Omit<BoxTagProps<'svg'>, 'viewBox' | 'width' | 'height'>;

interface Props extends Omit<BoxStyleProps, 'width' | 'height'> {
  children?: React.ReactNode | ((props: { isHover: boolean }) => React.ReactNode);
  props?: BoxSvgTagProps;
  style?: React.ComponentProps<'svg'>['style'];
  className?: ClassNameType;
  viewBox?: string;
  width?: string;
  height?: string;
}

function BaseSvgImpl(props: Props, ref: Ref<SVGSVGElement>) {
  const { viewBox = '0 0 24 24', width = '1.5rem', height, props: tagProps, ...restProps } = props;

  return (
    <Box
      tag="svg"
      ref={ref}
      props={{ ...tagProps, viewBox, width, height, xmlns: 'http://www.w3.org/2000/svg', fill: 'none' }}
      {...restProps}
    />
  );
}

const BaseSvg = forwardRef(BaseSvgImpl);
BaseSvg.displayName = 'BaseSvg';

export default BaseSvg;

export type BaseSvgProps = React.ComponentProps<typeof BaseSvgImpl>;
