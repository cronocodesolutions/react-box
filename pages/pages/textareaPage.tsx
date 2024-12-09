import Box from '../../src/box';
import Textarea from '../../src/components/textarea';
import Code from '../components/code';

export default function TextareaPage() {
  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Textarea
      </Box>
      <Box tag="h4" fontSize={18} fontWeight={400} mb={10}>
        Use Textarea component in order enter and edit users multiline data
      </Box>

      <Code label="Import" code="import Textarea from '@cronocode/react-box/components/textarea';" />

      <Code label="Basic Textarea" code='<Textarea placeholder="ex. description" />' mt={10}>
        <Textarea placeholder="ex. description" />
      </Code>

      <Code label="Disabled Textarea" code='<Textarea disabled defaultValue="Disabled" />' mt={10}>
        <Textarea disabled defaultValue="Disabled" />
      </Code>
    </Box>
  );
}
