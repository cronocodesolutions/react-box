import { useLayoutEffect } from 'react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Prism from 'prismjs';
import Code from '../components/code';

export default function HomePage() {
  useLayoutEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Flex ai="center" width="fit" mt={20} d="column">
      <Flex d="column" ai="center" textAlign="center">
        <Box fontSize={44} fontWeight={500} maxWidth={200}>
          Productivity tool to rapidly build modern web app based on React library
        </Box>
        <Box fontSize={18} fontWeight={300} mt={6}>
          <Box>Utility framework with multiple props which cover all CSS styles.</Box>
          <Box> Never DRY with your CSS styles. Keep typescript compilation power.</Box>
        </Box>
      </Flex>
      <Box mt={20} fontSize={30}>
        Steps to start
      </Box>

      <Box mt={12}>
        <Flex ai="center" gap={3}>
          <Box component="number">1</Box>
          <Box>Install npm library</Box>
        </Flex>
        <Code language="shell">{`npm install @cronocode/react-box`}</Code>
        <Flex ai="center" gap={3} mt={10}>
          <Box component="number">2</Box>
          <Box>Usage</Box>
        </Flex>
        <Code language="javascript">
          {`import Box from '@cronocode/react-box';

function Component () {
  return <Box>Hello world</Box>;
}`}
        </Code>
      </Box>
    </Flex>
  );
}
