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
      {/* <Box> */}
      <Box fontSize={60} color="violet">
        Productivity tool
      </Box>
      <Box fontSize={24}>to rapidly build modern web app based on React library.</Box>
      {/* </Box> */}
      <Box mt={20} fontSize={30}>
        Steps to start
      </Box>

      <Box mt={12}>
        <Flex ai="center" gap={3}>
          <Box component="number">1</Box>
          <Box>Install npm library</Box>
        </Flex>
        <Code language="shell">{`npm install @cronocode/react-box`}</Code>
        <Flex ai="center" gap={3} mt={5}>
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
