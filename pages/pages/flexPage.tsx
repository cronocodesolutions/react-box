import Box from '../../src/box';
import Flex from '../../src/components/flex/flex';

export default function FlexPage() {
  return (
    <Flex p={10}>
      <Box fontSize={50} lineHeight="font-size" bgColor="violetLight" width="3/5" textDecoration="underline">
        This is Flex page
      </Box>
    </Flex>
  );
}
