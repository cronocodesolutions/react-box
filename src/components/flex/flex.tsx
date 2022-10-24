import Box from '../../box';

type BoxProps = React.ComponentProps<typeof Box>;

interface FlexStylesShortCuts {
  wrap?: BoxProps['flexWrap'];
  jc?: BoxProps['justifyContent'];
  ai?: BoxProps['alignItems'];
  ac?: BoxProps['alignContent'];
  d?: BoxProps['direction'];
  grow?: BoxProps['flexGrow'];
  shrink?: BoxProps['flexShrink'];
  as?: BoxProps['alignSelf'];
  js?: BoxProps['justifySelf'];
}

type Props = BoxProps & FlexStylesShortCuts & Hovered<FlexStylesShortCuts>;

export default function Flex(props: Props) {
  const { inline } = props;

  return <Box display={inline ? 'inline-flex' : 'flex'} {...props} />;
}
