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

      <Label b={1} borderRadius={1} p={2} mt={2} focusGroup="parent">
        <Box inline>delete text from textbox and change focus</Box>
        <Box mt={2}>
          <Textbox width={60} invalid={{ borderColor: 'red' }} required defaultValue="text" />
        </Box>
      </Label>

      <Label hasFocus={{ color: 'violet', textDecoration: 'underline' }} b={1} borderRadius={1} p={2} mt={2}>
        <Box mt={2}>change label color when focus textbox</Box>
        <Textbox mt={3} defaultValue="focus group" />
      </Label>
    </Box>
  );
}
