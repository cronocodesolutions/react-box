import { motion } from 'framer-motion';
import { AlignLeft } from 'lucide-react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Textarea from '../../src/components/textarea';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';

export default function TextareaPage() {
  return (
    <Box>
      <PageHeader icon={AlignLeft} title="Textarea" description="Use Textarea component to enter and edit multiline user data." />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import Textarea from '@cronocode/react-box/components/textarea';" />

          <Code label="Basic Textarea" language="jsx" code='<Textarea placeholder="ex. description" />'>
            <Textarea placeholder="ex. description" theme={{ dark: { bgColor: 'slate-800', color: 'white' } }} />
          </Code>

          <Code label="Disabled Textarea" language="jsx" code='<Textarea disabled defaultValue="Disabled" />'>
            <Textarea disabled defaultValue="Disabled" />
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}
