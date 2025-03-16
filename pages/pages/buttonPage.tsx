import { useRef, useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import Code from '../components/code';

export default function ButtonPage() {
  const [counter, setCounter] = useState(0);

  const ref = useRef<HTMLButtonElement>(null);
  const counterHandler = () => {
    console.log(ref.current?.getClientRects());

    setCounter((prev) => prev + 1);
  };

  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Button
      </Box>

      <Box tag="h4" fontSize={18} fontWeight={400} mb={10}>
        Use button component in order to handle user click behavior
      </Box>

      <Code label="Import" code="import Button from '@cronocode/react-box/components/button';" />

      <Code label="Basic Button" code="<Button>Basic</Button>" mt={10}>
        <Button>Basic</Button>
      </Code>

      <Code label="Disabled Button" code="<Button disabled>Disabled</Button>" mt={10}>
        <Button disabled onClick={() => alert('Click')}>
          Disabled
        </Button>
      </Code>

      <Code
        label="Increment Button"
        code={`function Component() {
  const [counter, setCounter] = useState(0);

  return (
    <Flex gap={3} ai="center">
      <Button onClick={() => setCounter((prev) => prev + 1)}>Increase count!</Button>
      <Box fontSize={18}>{counter}</Box>
    </Flex>
  );
}`}
        mt={10}
      >
        <Flex gap={3} ai="center">
          <Button ref={ref} onClick={counterHandler}>
            Increase count!
          </Button>
          <Box fontSize={18}>{counter}</Box>
        </Flex>
      </Code>
    </Box>
  );
}
