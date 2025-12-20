import { motion } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';
import { useRef, useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';

export default function ButtonPage() {
  const [counter, setCounter] = useState(0);

  const ref = useRef<HTMLButtonElement>(null);
  const counterHandler = () => {
    setCounter((prev) => prev + 1);
  };

  return (
    <Box>
      <PageHeader
        icon={MousePointer2}
        title="Button"
        description="Interactive button component with multiple variants, states, and customization options."
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import Button from '@cronocode/react-box/components/button';" />

          <Code
            label="Basic Button"
            language="jsx"
            code={`<Button>Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>`}
          >
            <Flex gap={4} flexWrap="wrap">
              <Button>Click me</Button>
              <Button variant="secondary" theme={{ dark: { color: 'slate-300' } }}>
                Secondary
              </Button>
              <Button variant="ghost" theme={{ dark: { color: 'slate-300' } }}>
                Ghost
              </Button>
            </Flex>
          </Code>

          <Code label="Disabled State" language="jsx" code="<Button disabled>Disabled</Button>">
            <Flex gap={4}>
              <Button disabled>Disabled</Button>
              <Button variant="secondary" disabled theme={{ dark: { color: 'slate-500' } }}>
                Disabled
              </Button>
            </Flex>
          </Code>

          <Code
            label="With Counter"
            language="jsx"
            code={`function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Flex gap={4} ai="center">
      <Button onClick={() => setCount(c => c + 1)}>
        Clicked {count} times
      </Button>
      <Button
        variant="secondary"
        onClick={() => setCount(0)}
      >
        Reset
      </Button>
    </Flex>
  );
}`}
          >
            <Flex gap={4} ai="center">
              <Button ref={ref} onClick={counterHandler}>
                Clicked {counter} times
              </Button>
              <Button variant="secondary" theme={{ dark: { color: 'slate-300' } }} onClick={() => setCounter(0)}>
                Reset
              </Button>
            </Flex>
          </Code>

          <Code
            label="Custom Styling"
            language="jsx"
            code={`<Button bgColor="emerald-500" hover={{ bgColor: 'emerald-600' }}>
  Success
</Button>
<Button bgColor="rose-500" hover={{ bgColor: 'rose-600' }}>
  Danger
</Button>
<Button bgImage="gradient-accent">
  Gradient
</Button>`}
          >
            <Flex gap={4} flexWrap="wrap">
              <Button bgImage="none" bgColor="emerald-500" hover={{ bgColor: 'emerald-600' }}>
                Success
              </Button>
              <Button bgImage="none" bgColor="rose-500" hover={{ bgColor: 'rose-600' }}>
                Danger
              </Button>
              <Button bgImage="gradient-accent">Gradient</Button>
            </Flex>
          </Code>

          <Code
            label="Sizes"
            language="jsx"
            code={`<Button py={2} px={3} fontSize={12}>Small</Button>
<Button>Default</Button>
<Button py={4} px={8} fontSize={16}>Large</Button>`}
          >
            <Flex gap={4} ai="center" flexWrap="wrap">
              <Button py={2} px={3} fontSize={12}>
                Small
              </Button>
              <Button>Default</Button>
              <Button py={4} px={8} fontSize={16}>
                Large
              </Button>
            </Flex>
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}
