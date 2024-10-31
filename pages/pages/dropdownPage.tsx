import Box from '../../src/box';
import Dropdown from '../../src/components/dropdown';

export default function DropdownPage() {
  return (
    <Box p={10}>
      <Box mb={3} fontSize={24}>
        Dropdown
      </Box>
      <Box py={3}>
        <Dropdown>
          <Dropdown.Item value="test">test</Dropdown.Item>
          <Dropdown.Item value="test2">test2</Dropdown.Item>
        </Dropdown>
      </Box>
      <Box py={3}>
        <Dropdown onChange={(value) => console.log(value)}>
          <Dropdown.NullItem>Select Item</Dropdown.NullItem>
          <Dropdown.Item value="test">test</Dropdown.Item>
          <Dropdown.Item value="test2">test2</Dropdown.Item>
        </Dropdown>
      </Box>
      <Box py={3}>
        <Dropdown disabled>
          <Dropdown.Item value="test">Disabled</Dropdown.Item>
          <Dropdown.Item value="test2">test2</Dropdown.Item>
        </Dropdown>
      </Box>
      <Box py={3}>
        <Dropdown name="item" minWidth={40} isSearchable>
          <Dropdown.NoItems>Empty</Dropdown.NoItems>
          <Dropdown.NullItem>Select</Dropdown.NullItem>
          <Dropdown.Item value={10}>ten</Dropdown.Item>
          <Dropdown.Item value={JSON.stringify({ a: 4, b: 4 })}>twenty</Dropdown.Item>
          <Dropdown.Item value={30}>thirty</Dropdown.Item>
          <Dropdown.Item value={301}>thirty2</Dropdown.Item>
          <Dropdown.Item value={302}>thirty3</Dropdown.Item>
          <Dropdown.Item value={3043}>thirty4</Dropdown.Item>
          <Dropdown.Item value={304}>
            hx
            <Box inline>
              test<Box>max</Box>
              <Box>max2</Box>
            </Box>
            <Box inline>test2</Box>
          </Dropdown.Item>
        </Dropdown>
      </Box>
      <Box py={3}>
        <Dropdown name="item" minWidth={40} isSearchable>
          <Dropdown.NoItems>Empty</Dropdown.NoItems>
          <Dropdown.Item value={10}>ten</Dropdown.Item>
          <Dropdown.Item value={JSON.stringify({ a: 4, b: 4 })}>twenty</Dropdown.Item>
          <Dropdown.Item value={30}>thirty</Dropdown.Item>
          <Dropdown.Item value={301}>thirty2</Dropdown.Item>
          <Dropdown.Item value={302}>thirty3</Dropdown.Item>
          <Dropdown.Item value={3043}>thirty4</Dropdown.Item>
          <Dropdown.Item value={304}>
            hx
            <Box inline>
              test<Box>max</Box>
              <Box>max2</Box>
            </Box>
            <Box inline>test2</Box>
          </Dropdown.Item>
        </Dropdown>
      </Box>
    </Box>
  );
}
