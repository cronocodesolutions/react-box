import { useRef, useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';

export default function ButtonPage() {
  const [counter, setCounter] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <Box p={10}>
      <Flex py={3} ai="center" gap={4}>
        <Button onClick={() => setCounter((prev) => prev + 1)}>Click me!</Button>
        {counter > 0 && <Box fontSize={18}>{counter}</Box>}
      </Flex>
      <Button disabled onClick={() => alert('Click')} ref={ref}>
        Disabled
      </Button>
      <Box mt={4}>
        <Button theme="reverse">Reverse</Button>
      </Box>
      <Box mt={4}>
        <Button theme="reverse" disabled>
          Reverse disabled
        </Button>
      </Box>
    </Box>
  );
}
