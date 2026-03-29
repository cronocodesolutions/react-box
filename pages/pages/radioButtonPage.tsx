import { motion } from 'framer-motion';
import { Circle } from 'lucide-react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import RadioButton from '../../src/components/radioButton';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import useTableOfContents from '../hooks/useTableOfContents';

export default function RadioButtonPage() {
  useTableOfContents(sidebarLinks);

  return (
    <Box>
      <PageHeader icon={Circle} title="Radio Button" description="Use RadioButton component to choose an option from a group." />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import RadioButton from '@cronocode/react-box/components/radioButton';" />

          <Code
            id="basic"
            label="Basic RadioButton"
            language="jsx"
            code={`<Flex gap={2}>
  <RadioButton defaultChecked name="FieldName" /> Option 1
  <RadioButton name="FieldName" /> Option 2
</Flex>`}
          >
            <Flex gap={2}>
              <RadioButton defaultChecked name="FieldName" /> Option 1
              <RadioButton name="FieldName" /> Option 2
            </Flex>
          </Code>

          <Code
            id="disabled"
            label="Disabled RadioButton"
            language="jsx"
            code={`<Flex gap={2}>
  <RadioButton disabled defaultChecked name="Disabled" /> Option 1
  <RadioButton disabled name="Disabled" /> Option 2
</Flex>`}
          >
            <Flex gap={2}>
              <RadioButton disabled defaultChecked name="Disabled" /> Option 1
              <RadioButton disabled name="Disabled" /> Option 2
            </Flex>
          </Code>

          <Code
            id="clean"
            label="Clean RadioButton"
            language="jsx"
            code={`<Flex gap={2}>
  <RadioButton clean defaultChecked name="FieldName" /> Option 1
  <RadioButton clean name="FieldName" /> Option 2
</Flex>`}
          >
            <Flex gap={2}>
              <RadioButton clean defaultChecked name="FieldName1" /> Option 1
              <RadioButton clean name="FieldName1" /> Option 2
            </Flex>
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}

const sidebarLinks = [
  { id: 'basic', label: 'Basic' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'clean', label: 'Clean' },
] as const;
