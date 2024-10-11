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

      <Box mt={4}>
        <Dropdown minWidth={40}>
          <Dropdown.Item value={10}>ten</Dropdown.Item>
          <Dropdown.Item value={20}>twenty</Dropdown.Item>
          <Dropdown.Item value={30}>thirty</Dropdown.Item>
          <Dropdown.Item value={301}>thirty2</Dropdown.Item>
          <Dropdown.Item value={302}>thirty3</Dropdown.Item>
          <Dropdown.Item value={3043}>thirty4</Dropdown.Item>
          <Dropdown.Item value={304}>thirty5</Dropdown.Item>
        </Dropdown>
      </Box>
    </Box>
  );
}
