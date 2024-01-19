import { Ref, forwardRef, RefAttributes } from 'react';
import Box from '../box';

type BoxProps<TTag extends keyof JSX.IntrinsicElements = 'div'> = Omit<React.ComponentProps<typeof Box<TTag>>, 'ref'>;

function Grid<TTag extends keyof JSX.IntrinsicElements = 'div'>(props: BoxProps<TTag>, ref: Ref<ExtractElementFromTag<TTag>>) {
  const { inline, ...restProps } = props;

  return <Box ref={ref} display={inline ? 'inline-grid' : 'grid'} {...restProps} />;
}

export default forwardRef(Grid) as <TTag extends keyof JSX.IntrinsicElements = 'div'>(
  props: BoxProps<TTag> & RefAttributes<ExtractElementFromTag<TTag>>,
) => JSX.Element;
