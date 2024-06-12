import { Ref, forwardRef } from 'react';
import Box, { BoxProps } from '../box';

interface Props extends Omit<BoxProps<'label'>, 'ref' | 'tag'> {}

function Label(props: Props, ref: Ref<HTMLLabelElement>) {
  return <Box tag="label" ref={ref} component="label" {...props} />;
}

export default forwardRef(Label);
