import Box from '../../src/box';
import Dropdown from '../../src/components/dropdown';

export default function DropdownPage() {
  return (
    <Box p={10}>
      <Box mt={10}>
        <Dropdown>
          <Dropdown.Item value="test">test</Dropdown.Item>
          <Dropdown.Item value="test2">test2</Dropdown.Item>
        </Dropdown>
      </Box>

      <Box mt={10}>
        <Dropdown minWidth={20}>
          <Dropdown.Item value={10}>ten</Dropdown.Item>
          <Dropdown.Item value={20}>twenty</Dropdown.Item>
          <Dropdown.Item value={30}>thirty</Dropdown.Item>
        </Dropdown>
      </Box>
    </Box>
  );
}
