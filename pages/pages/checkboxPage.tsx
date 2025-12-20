import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import Box from '../../src/box';
import Checkbox from '../../src/components/checkbox';
import Flex from '../../src/components/flex';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';

export default function CheckboxPage() {
  return (
    <Box>
      <PageHeader icon={CheckSquare} title="Checkbox" description="Use Checkbox component to turn an option on or off." />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import Checkbox from '@cronocode/react-box/components/checkbox';" />

          <Code label="Basic Checkbox" language="jsx" code="<Checkbox defaultChecked />">
            <Checkbox defaultChecked />
          </Code>

          <Code label="Clean Checkbox" language="jsx" code="<Checkbox clean defaultChecked />">
            <Checkbox clean defaultChecked />
          </Code>

          <Code label="Disabled Checkbox" language="jsx" code="<Checkbox disabled defaultChecked />">
            <Checkbox disabled defaultChecked />
          </Code>

          <Code label="Indeterminate Checkbox" language="jsx" code="<Checkbox indeterminate />">
            <Checkbox indeterminate />
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}
