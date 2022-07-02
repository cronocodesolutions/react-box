import Box from '../../box';

type BoxProps = React.ComponentProps<typeof Box>;

interface BoxFlex {
  wrap?: BoxProps['flexWrap'];
  jc?: BoxProps['justifyContent'];
  ai?: BoxProps['alignItems'];
  ac?: BoxProps['alignContent'];
  d?: BoxProps['direction'];
  grow?: BoxProps['flexGrow'];
  shrink?: BoxProps['flexShrink'];
  as?: BoxProps['alignSelf'];
}

type Props = React.ComponentProps<typeof Box> & BoxFlex;

export default function Flex(props: Props) {
  const { wrap, jc, ai, ac, d, grow, shrink, as } = props;

  return (
    <Box
      display="flex"
      flexWrap={wrap}
      justifyContent={jc}
      alignItems={ai}
      alignContent={ac}
      direction={d}
      flexGrow={grow}
      flexShrink={shrink}
      alignSelf={as}
      {...props}
    />
  );
}
