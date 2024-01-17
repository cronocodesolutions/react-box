import { Ref, forwardRef } from 'react';
import Box from '../box';

type BoxProps<TTag extends keyof React.ReactHTML> = Omit<React.ComponentProps<typeof Box<TTag>>, 'ref'>;

function Grid<TTag extends keyof React.ReactHTML = 'div'>(props: BoxProps<TTag>, ref: Ref<HTMLElement>) {
  const { inline } = props;

  return <Box ref={ref} display={inline ? 'inline-grid' : 'grid'} {...props} />;
}

export default forwardRef(Grid) as <TTag extends keyof React.ReactHTML = 'div'>(props: BoxProps<TTag>) => JSX.Element;
