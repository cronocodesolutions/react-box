import { Ref, forwardRef, RefAttributes } from 'react';
import Box, { BoxProps } from '../box';
import { ExtractElementFromTag } from '../core/coreTypes';

function Grid<TTag extends keyof React.JSX.IntrinsicElements = 'div'>(props: BoxProps<TTag>, ref: Ref<ExtractElementFromTag<TTag>>) {
  const { inline, ...restProps } = props;

  return <Box ref={ref} display={inline ? 'inline-grid' : 'grid'} {...restProps} />;
}

export default forwardRef(Grid) as <TTag extends keyof React.JSX.IntrinsicElements = 'div'>(
  props: BoxProps<TTag> & RefAttributes<ExtractElementFromTag<TTag>>,
) => React.ReactNode;
