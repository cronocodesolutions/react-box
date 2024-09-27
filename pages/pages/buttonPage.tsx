import { useRef, useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import BaseSvg from '../../src/components/baseSvg';

export default function ButtonPage() {
  const [counter, setCounter] = useState(0);
  const ref = useRef(null);

  return (
    <Box p={10}>
      <Flex py={3} ai="center" gap={4}>
        <Button props={{}} onClick={() => setCounter((prev) => prev + 1)}>
          Click me!
        </Button>
        {counter > 0 && <Box fontSize={18}>{counter}</Box>}
      </Flex>
      <Button disabled onClick={() => alert('Click')} ref={ref}>
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
        <Button disabled={[true, { color: 'violet' }]} width={60} onClick={() => alert('disabled group')}>
          Disabled group
          <Box ml={2} hoverGroup={{ test: { color: 'red' } }}>
            test
          </Box>
          <BaseSvg rotate={180} width="1rem" viewBox="0 0 16 16" fill="violet" hoverGroup={{ test: { fill: 'red', ml: 8 } }} ml={4}>
            <path d="M6.83202 3.66108C7.12492 3.36818 7.59979 3.36818 7.89268 3.66108C8.18558 3.95397 8.18558 4.42884 7.89268 4.72174L6.83202 3.66108ZM3.55369 8.00007L3.02336 8.5304C2.8827 8.38975 2.80369 8.19899 2.80369 8.00007C2.80369 7.80116 2.8827 7.6104 3.02336 7.46974L3.55369 8.00007ZM7.89268 11.2784C8.18558 11.5713 8.18558 12.0462 7.89268 12.3391C7.59979 12.632 7.12492 12.632 6.83202 12.3391L7.89268 11.2784ZM12.4297 7.25007C12.8439 7.25007 13.1797 7.58586 13.1797 8.00007C13.1797 8.41429 12.8439 8.75007 12.4297 8.75007V7.25007ZM3.56502 8.75007C3.15081 8.75007 2.81502 8.41429 2.81502 8.00007C2.81502 7.58586 3.15081 7.25007 3.56502 7.25007V8.75007ZM7.89268 4.72174L4.08402 8.5304L3.02336 7.46974L6.83202 3.66108L7.89268 4.72174ZM4.08402 7.46974L7.89268 11.2784L6.83202 12.3391L3.02336 8.5304L4.08402 7.46974ZM12.4297 8.75007H3.56502V7.25007H12.4297V8.75007Z" />
          </BaseSvg>
        </Button>
      </Box>
    </Box>
  );
}
