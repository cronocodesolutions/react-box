import Box from '../../src/box';
import Flex from '../../src/components/flex/flex';
import RadioButton from '../../src/components/radioButton/radioButton';

export default function RadioButtonPage() {
  return (
    <Box>
      <Box py={3}>
        <Flex gap={2}>
          <RadioButton defaultChecked name="Theme" /> Theme 1
          <RadioButton defaultChecked name="Theme" /> Theme 2
        </Flex>
        <Flex mt={2} gap={2}>
          <RadioButton clean name="Clean" /> Clean 1
          <RadioButton clean name="Clean" /> Clean 2
        </Flex>
        <Flex mt={2} gap={2}>
          <RadioButton native name="native" /> Native
          <RadioButton native name="native" /> Native
        </Flex>
      </Box>
    </Box>
  );
}
