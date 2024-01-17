import { useState } from 'react';
import Box from '../../src/box';
import Textbox from '../../src/components/textbox';

export default function TextboxPage() {
  const [controlledValue, setControlledValue] = useState('controlled');

  return (
    <Box>
      <Box py={3}>
        <Textbox />
      </Box>
      <Box py={3}>
        <Box tag="label">
          <Textbox value={controlledValue} onChange={(e) => setControlledValue(e.target.value)} />
        </Box>
      </Box>
      <Box py={3}>
        <Textbox defaultValue="uncontrolled" />
      </Box>
    </Box>
  );
}
