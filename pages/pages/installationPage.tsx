import Box from '../../src/box';
import Code from '../components/code';

export default function InstallationPage() {
  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Installation
      </Box>

      <Box tag="h4" fontSize={18} fontWeight={400} mb={10}>
        Install React Box.
      </Box>

      <Code language="shell" label="Default installation" code={`npm install @cronocode/react-box -S`}>
        {/* <Box fontSize={48} textAlign="center">
          DONE!
        </Box> */}
      </Code>

      <Box fontSize={40} textAlign="center" mt={10}>
        That's it!!!
      </Box>
    </Box>
  );
}
