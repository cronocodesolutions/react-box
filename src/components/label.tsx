import { forwardRef } from 'react';
import Box, { BoxProps } from '../box';

interface Props extends Omit<BoxProps<'label'>, 'tag'> {}

function Label(props: Props) {
  return <Box tag="label" component="label" {...props} />;
}

export default forwardRef(Label);
