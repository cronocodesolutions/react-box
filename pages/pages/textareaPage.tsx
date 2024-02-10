import { useState } from 'react';
import Box from '../../src/box';
import Textarea from '../../src/components/textarea';
import Flex from '../../src/components/flex';

export default function TextareaPage() {
  const [controlledValue, setControlledValue] = useState('controlled');

  return (
    <Box p={10}>
      <Box py={3}>
        <Textarea defaultValue="uncontrolled" />
      </Box>
      <Flex py={3}>
        <Box tag="label">
          <Textarea value={controlledValue} onChange={(e) => setControlledValue(e.target.value)} />
        </Box>
        <Box tag="label" ml={4}>
          <Textarea value="controlled without update" />
        </Box>
      </Flex>
      <Textarea disabled mt={3} defaultValue="disabled" />
    </Box>
  );
}
