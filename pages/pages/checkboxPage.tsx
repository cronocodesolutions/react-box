import Box from '../../src/box';
import Checkbox from '../../src/components/checkbox';
import Flex from '../../src/components/flex';

export default function CheckboxPage() {
  return (
    <Box p={10}>
      <Box tag="h1" mb={3} fontSize={24}>
        Checkbox
      </Box>
      <Flex py={3} gap={2} ai="center">
        <Checkbox /> Default
      </Flex>
      <Flex py={3} gap={2} ai="center">
        <Checkbox clean /> Clean
      </Flex>
      <Flex py={3} gap={2} ai="center">
        <Checkbox disabled /> Disabled
      </Flex>
      <Flex py={3} gap={2} ai="center">
        <Checkbox indeterminate /> Indeterminate
      </Flex>
    </Box>
  );
}
