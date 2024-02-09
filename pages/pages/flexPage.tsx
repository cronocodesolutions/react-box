import Box from '../../src/box';
import Flex from '../../src/components/flex';

export default function FlexPage() {
  return (
    <Flex p={10} d="column">
      <Box fontSize={50} lineHeight="font-size" bgColor="violetLight" width="3/5" textDecoration="underline">
        This is Flex page
      </Box>

      <Box component="mycomponent" mt={4}>
        <Box component="mycomponent.item1">this is item 1</Box>
        <Box component="mycomponent.item2">this is item 2</Box>
      </Box>
    </Flex>
  );
}
