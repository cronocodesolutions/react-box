import Box from '../../src/box';
import Flex from '../../src/components/flex';
import RadioButton from '../../src/components/radioButton';
import Code from '../components/code';

export default function RadioButtonPage() {
  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Radio Button
      </Box>

      <Box tag="h4" fontSize={18} fontWeight={400} mb={10}>
        Use RadioButton component in order to choose an option
      </Box>

      <Code label="Import" code="import RadioButton from '@cronocode/react-box/components/radioButton';" />

      <Code
        label="Basic RadioButton"
        code={`<Flex gap={2}>
  <RadioButton defaultChecked name="FieldName" /> Option 1
  <RadioButton name="FieldName" /> Option 2
</Flex>`}
        mt={10}
      >
        <Flex gap={2}>
          <RadioButton defaultChecked name="FieldName" /> Option 1
          <RadioButton name="FieldName" /> Option 2
        </Flex>
      </Code>

      <Code
        label="Disabled RadioButton"
        code={`<Flex gap={2}>
  <RadioButton disabled defaultChecked name="Disabled" /> Option 1
  <RadioButton disabled name="Disabled" /> Option 2
</Flex>`}
        mt={10}
      >
        <Flex gap={2}>
          <RadioButton disabled defaultChecked name="Disabled" /> Option 1
          <RadioButton disabled name="Disabled" /> Option 2
        </Flex>
      </Code>

      <Code
        label="Clean RadioButton"
        code={`<Flex gap={2}>
  <RadioButton clean defaultChecked name="FieldName" /> Option 1
  <RadioButton clean name="FieldName" /> Option 2
</Flex>`}
        mt={10}
      >
        <Flex gap={2}>
          <RadioButton clean defaultChecked name="FieldName1" /> Option 1
          <RadioButton clean name="FieldName1" /> Option 2
        </Flex>
      </Code>
    </Box>
  );
}
