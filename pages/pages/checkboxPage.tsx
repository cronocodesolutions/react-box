import Box from '../../src/box';
import Checkbox from '../../src/components/checkbox';
import Code from '../components/code';

export default function CheckboxPage() {
  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Checkbox
      </Box>
      <Box tag="h4" fontSize={18} fontWeight={400} mb={10}>
        Use Checkbox component in order to turn an option on or off
      </Box>

      <Code label="Import" code="import Checkbox from '@cronocode/react-box/components/checkbox';" />

      <Code label="Basic Checkbox" code="<Checkbox defaultChecked />" mt={10}>
        <Checkbox defaultChecked />
      </Code>

      <Code label="Clean Checkbox" code="<Checkbox clean defaultChecked />" mt={10}>
        <Checkbox clean defaultChecked />
      </Code>

      <Code label="Disabled Checkbox" code="<Checkbox disabled defaultChecked />" mt={10}>
        <Checkbox disabled defaultChecked />
      </Code>

      <Code label="Indeterminate Checkbox" code="<Checkbox indeterminate />" mt={10}>
        <Checkbox indeterminate />
      </Code>
    </Box>
  );
}
