import Box from '../../src/box';
import Flex from '../../src/components/flex';
import RadioButton from '../../src/components/radioButton';

export default function RadioButtonPage() {
  return (
    <Box p={10}>
      <Box py={3}>
        <Flex gap={2}>
          <RadioButton defaultChecked name="Theme" /> Theme 1
          <RadioButton defaultChecked name="Theme" /> Theme 2
        </Flex>
        <Flex mt={2} gap={2}>
          <RadioButton name="Clean" disabled defaultChecked /> Disabled 1
          <RadioButton name="Clean" disabled={[true, { borderColor: 'red' }]} /> Disabled 2
        </Flex>
      </Box>
    </Box>
  );
}
