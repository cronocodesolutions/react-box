import { useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button/button';
import Flex from '../../src/components/flex/flex';

export default function ButtonPage() {
  const [counter, setCounter] = useState(0);

  return (
    <Box>
      <Box py={3}>
        <Button disabled onClick={() => alert('Click')}>
          Click me! (disabled)
        </Button>
      </Box>
      <Flex py={3} ai="center" gap={4}>
        <Button onClick={() => setCounter((prev) => prev + 1)}>Click me!</Button>
        {counter > 0 && <Box fontSize={18}>{counter}</Box>}
      </Flex>
    </Box>
  );
}
