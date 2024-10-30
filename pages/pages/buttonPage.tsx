import { useRef, useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';

export default function ButtonPage() {
  const [counter, setCounter] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <Box p={10}>
      <Box mb={3} fontSize={24}>
        Button
      </Box>
      <Flex gap={3} ai="center" py={3}>
        <Button onClick={() => setCounter((prev) => prev + 1)}>Increase count!</Button>
        <Box fontSize={18}>{counter}</Box>
      </Flex>
      <Box py={3}>
        <Button disabled onClick={() => alert('Click')} ref={ref}>
          Disabled
        </Button>
      </Box>
    </Box>
  );
}
