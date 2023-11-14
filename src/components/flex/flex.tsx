import Box from '../../box';

type BoxProps = React.ComponentProps<typeof Box>;

export default function Flex(props: BoxProps) {
  const { inline } = props;

  return <Box display={inline ? 'inline-flex' : 'flex'} {...props} />;
}
