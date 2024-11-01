import Box from '../../src/box';
import Textarea from '../../src/components/textarea';

export default function TextareaPage() {
  return (
    <Box p={10}>
      <Box tag="h1" mb={3} fontSize={24}>
        Textarea
      </Box>
      <Box py={3}>
        <Textarea placeholder="ex. description" />
      </Box>
      <Box py={3}>
        <Textarea disabled defaultValue="Disabled" />
      </Box>
    </Box>
  );
}
