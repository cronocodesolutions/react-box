import Box from '../../src/box';
import Flex from '../../src/components/flex';

export default function FlexPage() {
  return (
    <Flex p={10} d="column">
      <Box
        fontSize={50}
        lineHeight="font-size"
        bgColor="violet-100"
        width="3/5"
        textDecoration="underline"
        xl={{ hover: { color: 'violet-500' } }}
      >
        This is Flex page
      </Box>

      <Box component="mycomponent" mt={4} hover={{ bgColor: 'violet-500' }} hoverGroup="group">
        <Box component="mycomponent.item1" hoverGroup={{ group: { color: 'red' } }}>
          this is item 1
        </Box>
        <Box component="mycomponent.item2">this is item 2</Box>
      </Box>
    </Flex>
  );
}
