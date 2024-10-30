import Box from '../../src/box';
import Flex from '../../src/components/flex';
import RadioButton from '../../src/components/radioButton';

export default function RadioButtonPage() {
  return (
    <Box p={10}>
      <Box mb={3} fontSize={24}>
        Radio Button
      </Box>

      <Flex py={3} gap={2}>
        <RadioButton defaultChecked name="Theme" /> Option 1
        <RadioButton name="Theme" /> Option 1
      </Flex>
      <Flex py={3} gap={2}>
        <RadioButton name="Disabled" disabled defaultChecked /> Disabled 1
        <RadioButton name="Disabled" disabled /> Disabled 2
      </Flex>
      <Flex py={3} gap={2}>
        <RadioButton name="Clean" clean defaultChecked /> Clean 1
        <RadioButton name="Clean" clean /> Clean 2
      </Flex>
    </Box>
  );
}
