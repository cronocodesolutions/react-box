import { useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';

export default function ButtonPage() {
  const [counter, setCounter] = useState(0);

  return (
    <Box p={10}>
      <Flex py={3} ai="center" gap={4}>
        <Button onClick={() => setCounter((prev) => prev + 1)}>Click me!</Button>
        {counter > 0 && <Box fontSize={18}>{counter}</Box>}
      </Flex>
      <Button disabled onClick={() => alert('Click')}>
        Disabled
      </Button>

      <Box mt={2}>
        <Button theme="ghost" onClick={() => alert('ghost')}>
          Ghost
        </Button>
      </Box>
      <Box mt={2}>
        <Button theme="ghost" disabled onClick={() => alert('ghost')}>
          Ghost disabled
        </Button>
      </Box>

      <Box mt={2} hoverGroup="test" inline>
        <Button
          disabled={[true, { color: 'violet' }]}
          width={40}
          hoverGroup={{ test: { width: 60 } }}
          onClick={() => alert('disabled group')}
        >
          Disabled group
          <Box ml={2} hoverGroup={{ test: { color: 'red' } }}>
            test
          </Box>
        </Button>
      </Box>
    </Box>
  );
}
