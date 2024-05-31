import { useState } from 'react';
import Box from '../../src/box';
import Textbox from '../../src/components/textbox';
import Flex from '../../src/components/flex';

export default function TextboxPage() {
  const [controlledValue, setControlledValue] = useState('controlled');

  return (
    <Box p={10}>
      <Box py={3}>
        <Textbox defaultValue="uncontrolled" />
      </Box>
      <Flex py={3}>
        <Box tag="label">
          <Textbox value={controlledValue} onChange={(e) => setControlledValue(e.target.value)} />
        </Box>
        <Box tag="label" ml={4}>
          <Textbox value="controlled without update" onChange={() => {}} />
        </Box>
      </Flex>
      <Box>
        <Textbox disabled mt={3} defaultValue="disabled" />
      </Box>

      <Box focusGroup="text">
        <Textbox mt={3} defaultValue="focus group" />
        <Box mt={2} focusGroup={{ text: { color: 'red' } }}>
          change label color when focus textbox
        </Box>
      </Box>

      <Box focusGroup="text">
        <Textbox mt={3} defaultValue="focus group" />
        <Box mt={2} focusGroup={{ text: { color: 'violet' } }}>
          change label color when focus textbox
        </Box>
      </Box>
    </Box>
  );
}
