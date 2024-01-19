import { Ref, forwardRef, RefAttributes } from 'react';
import Box from '../box';

type BoxProps<TTag extends keyof JSX.IntrinsicElements = 'div'> = Omit<React.ComponentProps<typeof Box<TTag>>, 'ref'>;

function Flex<TTag extends keyof JSX.IntrinsicElements = 'div'>(props: BoxProps<TTag>, ref: Ref<ExtractElementFromTag<TTag>>) {
  const { inline, ...restProps } = props;

  return <Box ref={ref} display={inline ? 'inline-flex' : 'flex'} {...restProps} />;
}

export default forwardRef(Flex) as <TTag extends keyof JSX.IntrinsicElements = 'div'>(
  props: BoxProps<TTag> & RefAttributes<ExtractElementFromTag<TTag>>,
) => JSX.Element;
