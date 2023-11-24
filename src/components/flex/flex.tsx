import { Ref, forwardRef } from 'react';
import Box from '../../box';

type BoxProps<TTag extends keyof React.ReactHTML> = React.ComponentProps<typeof Box<TTag>>;

function Flex<TTag extends keyof React.ReactHTML = 'div'>(props: BoxProps<TTag>, ref: Ref<HTMLElement>) {
  const { inline } = props;

  return <Box ref={ref} display={inline ? 'inline-flex' : 'flex'} {...props} />;
}

export default forwardRef(Flex) as <TTag extends keyof React.ReactHTML = 'div'>(props: BoxProps<TTag>) => JSX.Element;
