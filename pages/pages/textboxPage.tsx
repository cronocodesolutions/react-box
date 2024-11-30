import { useState } from 'react';
import Box from '../../src/box';
import Textbox from '../../src/components/textbox';
import Flex from '../../src/components/flex';

export default function TextboxPage() {
  const [controlledValue, setControlledValue] = useState('');

  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Textbox
      </Box>
      <Box py={3}>
        <Textbox placeholder="ex. John" />
      </Box>
      <Flex py={3}>
        <Box tag="label">
          <Textbox placeholder="ex. Doe" value={controlledValue} onChange={(e) => setControlledValue(e.target.value)} />
        </Box>
      </Flex>
      <Box py={3}>
        <Textbox disabled defaultValue="Disabled" />
      </Box>
    </Box>
  );
}
