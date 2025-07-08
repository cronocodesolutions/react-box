import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Code from '../components/code';

export default function HomePage() {
  return (
    <Box mt={20} pb={10}>
      <Flex d="column" ai="center" textAlign="center">
        <Box tag="h1" fontSize={44} fontWeight={500} maxWidth={200}>
          The simplest possible productivity tool to start building web applications
        </Box>
        <Box fontSize={18} fontWeight={300} mt={6}>
          <Box>Utility framework with multiple props which cover all CSS styles.</Box>
          <Box>Never DRY with your CSS styles. Keep typescript compilation power.</Box>
        </Box>
      </Flex>
      <Flex mt={20} jc="center" fontSize={30}>
        Steps to start
      </Flex>

      <Flex mt={12} d="column" gap={10} mx="auto">
        <Code label="Install npm library" number={1} language="shell" code="npm install @cronocode/react-box"></Code>

        <Code
          label="Usage"
          number={2}
          language="jsx"
          code={`import Box from '@cronocode/react-box';

function Component () {
  return <Box>Hello world</Box>;
}`}
        ></Code>
      </Flex>
    </Box>
  );
}
