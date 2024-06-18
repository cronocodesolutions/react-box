import { useState } from 'react';
import Box from '../../src/box';
import Textbox from '../../src/components/textbox';
import Flex from '../../src/components/flex';
import Label from '../../src/components/label';
import Checkbox from '../../src/components/checkbox';

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
      <Box py={3}>
        <Textbox disabled defaultValue="disabled" />
      </Box>

      <Box py={3}>
        <Textbox width={60} required defaultValue="delete me and change focus" />
      </Box>

      <Label>
        test
        <Textbox width={60} invalid={{ borderColor: 'red' }} required defaultValue="delete me and change focus" />
      </Label>

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
