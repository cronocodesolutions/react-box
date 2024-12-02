import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Code from '../components/code';

export default function HomePage() {
  return (
    <Box mt={20} pb={10}>
      <Flex d="column" ai="center" textAlign="center">
        <Box fontSize={44} fontWeight={500} maxWidth={200}>
          Productivity tool to rapidly build modern web app based on React library
        </Box>
        <Box fontSize={18} fontWeight={300} mt={6}>
          <Box>Utility framework with multiple props which cover all CSS styles.</Box>
          <Box> Never DRY with your CSS styles. Keep typescript compilation power.</Box>
        </Box>
      </Flex>
      <Flex mt={20} jc="center" fontSize={30}>
        Steps to start
      </Flex>

      <Flex mt={12} maxWidth={100} d="column" gap={10} mx="auto">
        <Code label="Install npm library" number={1} language="shell">{`npm install @cronocode/react-box`}</Code>

        <Code label="Usage" number={2} language="jsx">
          {`import Box from '@cronocode/react-box';

function Component () {
  return <Box>Hello world</Box>;
}`}
        </Code>
      </Flex>
    </Box>
  );
}
