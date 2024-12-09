import { useState } from 'react';
import Box from '../../src/box';
import Textbox from '../../src/components/textbox';
import Code from '../components/code';

export default function TextboxPage() {
  const [controlledValue, setControlledValue] = useState('');

  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Textbox
      </Box>
      <Box tag="h4" fontSize={18} fontWeight={400} mb={10}>
        Use textbox component in order to enter and edit users data
      </Box>

      <Code label="Import" code="import Textbox from '@cronocode/react-box/components/textbox';" />

      <Code label="Basic Textbox" code='<Textbox placeholder="ex. John" />' mt={10}>
        <Textbox placeholder="ex. John" />
      </Code>

      <Code label="Disabled Textbox" code='<Textbox disabled defaultValue="Disabled" />' mt={10}>
        <Textbox disabled defaultValue="Disabled" />
      </Code>
    </Box>
  );
}
