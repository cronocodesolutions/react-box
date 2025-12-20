import { motion } from 'framer-motion';
import { Rows3 } from 'lucide-react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';

export default function FlexPage() {
  return (
    <Box>
      <PageHeader icon={Rows3} title="Flex" description="A shortcut component for display: flex with alignment and spacing props." />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import Flex from '@cronocode/react-box/components/flex';" />

          <Code
            label="Basic Flex"
            language="jsx"
            code={`<Flex gap={4} ai="center">
  <Box p={4} bgColor="violet-400" borderRadius={1} color="white">Item 1</Box>
  <Box p={4} bgColor="violet-500" borderRadius={1} color="white">Item 2</Box>
  <Box p={4} bgColor="violet-600" borderRadius={1} color="white">Item 3</Box>
</Flex>`}
          >
            <Flex gap={4} ai="center">
              <Box p={4} bgColor="violet-400" borderRadius={1} color="white">
                Item 1
              </Box>
              <Box p={4} bgColor="violet-500" borderRadius={1} color="white">
                Item 2
              </Box>
              <Box p={4} bgColor="violet-600" borderRadius={1} color="white">
                Item 3
              </Box>
            </Flex>
          </Code>

          <Code
            label="Column Direction"
            language="jsx"
            code={`<Flex d="column" gap={4}>
  <Box p={4} bgColor="indigo-400" borderRadius={1} color="white">Row 1</Box>
  <Box p={4} bgColor="indigo-500" borderRadius={1} color="white">Row 2</Box>
  <Box p={4} bgColor="indigo-600" borderRadius={1} color="white">Row 3</Box>
</Flex>`}
          >
            <Flex d="column" gap={4}>
              <Box p={4} bgColor="indigo-400" borderRadius={1} color="white">
                Row 1
              </Box>
              <Box p={4} bgColor="indigo-500" borderRadius={1} color="white">
                Row 2
              </Box>
              <Box p={4} bgColor="indigo-600" borderRadius={1} color="white">
                Row 3
              </Box>
            </Flex>
          </Code>

          <Code
            label="Justify Content"
            language="jsx"
            code={`<Flex jc="space-between" ai="center" p={4} bgColor="slate-100" borderRadius={1}>
  <Box p={3} bgColor="emerald-500" borderRadius={1} color="white">Start</Box>
  <Box p={3} bgColor="emerald-500" borderRadius={1} color="white">Middle</Box>
  <Box p={3} bgColor="emerald-500" borderRadius={1} color="white">End</Box>
</Flex>`}
          >
            <Flex jc="space-between" ai="center" p={4} bgColor="slate-100" borderRadius={1}>
              <Box p={3} bgColor="emerald-500" borderRadius={1} color="white">
                Start
              </Box>
              <Box p={3} bgColor="emerald-500" borderRadius={1} color="white">
                Middle
              </Box>
              <Box p={3} bgColor="emerald-500" borderRadius={1} color="white">
                End
              </Box>
            </Flex>
          </Code>

          <Code
            label="Flex Wrap"
            language="jsx"
            code={`<Flex gap={4} flexWrap="wrap">
  {[1, 2, 3, 4, 5, 6].map(i => (
    <Box key={i} p={4} width={24} bgColor="sky-500" borderRadius={1} color="white" textAlign="center">
      {i}
    </Box>
  ))}
</Flex>`}
          >
            <Flex gap={4} flexWrap="wrap">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Box key={i} p={4} width={24} bgColor="sky-500" borderRadius={1} color="white" textAlign="center">
                  {i}
                </Box>
              ))}
            </Flex>
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}
