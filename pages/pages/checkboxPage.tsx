import Box from '../../src/box';
import Checkbox from '../../src/components/checkbox';
import Flex from '../../src/components/flex';

export default function CheckboxPage() {
  return (
    <Box>
      <Box py={3}>
        <Flex gap={2}>
          <Checkbox /> Theme
        </Flex>
        <Flex mt={2} gap={2}>
          <Checkbox clean /> Clean
        </Flex>
        <Flex mt={2} gap={2}>
          <Checkbox native /> Native
        </Flex>
      </Box>
    </Box>
  );
}
