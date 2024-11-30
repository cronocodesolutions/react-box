import { useRef, useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import Code from '../components/code';
import Label from '../../src/components/label';

export default function ButtonPage() {
  const [counter, setCounter] = useState(0);

  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Button
      </Box>

      <Box tag="h4" fontSize={18} fontWeight={400} mb={10}>
        Use button component in order to handle user click/tap behavior
      </Box>

      <Label fontSize={22}>Import</Label>
      <Code>{`import Button from '@cronocode/react-box/components/button';`}</Code>

      <Button mt={10}>Basic</Button>
      <Code>{`<Button>Basic</Button>`}</Code>

      <Flex gap={3} ai="center" mt={10}>
        <Button onClick={() => setCounter((prev) => prev + 1)}>Increase count!</Button>
        <Box fontSize={18}>{counter}</Box>
      </Flex>
      <Code>{`<Button onClick={() => setCounter((prev) => prev + 1)}>
  Increase count!
</Button>`}</Code>

      <Button disabled onClick={() => alert('Click')} mt={10}>
        Disabled
      </Button>
      <Code>{`<Button disabled>Disabled</Button>`}</Code>
    </Box>
  );
}
