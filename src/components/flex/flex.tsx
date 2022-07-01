import Box from '../../box';

type Props = React.ComponentProps<typeof Box>;

export default function Flex(props: Props) {
  return <Box display="flex" {...props} />;
}
