import Box from '../../src/box';
import Checkbox from '../../src/components/checkbox';
import Flex from '../../src/components/flex';

export default function CheckboxPage() {
  return (
    <Box p={10}>
      <Box py={3}>
        <Flex gap={2}>
          <Checkbox /> Theme
        </Flex>
        <Flex mt={2} gap={2} disabled>
          <Checkbox disabled /> Disabled
          <Checkbox disabled defaultChecked /> Disabled Checked
        </Flex>
        <Checkbox mt={2} indeterminate /> Indeterminate
      </Box>
    </Box>
  );
}
