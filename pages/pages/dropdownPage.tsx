import { useState } from 'react';
import Box from '../../src/box';
import Dropdown from '../../src/components/dropdown';
import CheckboxSvg from '../svgs/checkboxSvg';

export default function DropdownPage() {
  const [selectedValues, setSelectedValues] = useState<number[]>([]);

  return (
    <Box p={10} pb={500}>
      <Box tag="h1" mb={3} fontSize={24}>
        Dropdown
      </Box>
      <Box py={3}>
        <Dropdown name="" defaultValue={true}>
          <Dropdown.Item value={3}>Three</Dropdown.Item>
          <Dropdown.Item value={true}>True</Dropdown.Item>
        </Dropdown>
      </Box>
      <Box py={3}>
        <Dropdown onChange={(value, values) => console.log(value, values)}>
          <Dropdown.UnselectItem>Select</Dropdown.UnselectItem>
          <Dropdown.Item value="test">test</Dropdown.Item>
          <Dropdown.Item value="test2">test2</Dropdown.Item>
        </Dropdown>
      </Box>
      <Box py={3}>
        <Dropdown disabled>
          <Dropdown.UnselectItem>Disabled</Dropdown.UnselectItem>
          <Dropdown.Item value="test">Disabled</Dropdown.Item>
          <Dropdown.Item value="test2">test2</Dropdown.Item>
        </Dropdown>
      </Box>
      <Box py={3}>
        <Dropdown name="item" isSearchable>
          <Dropdown.UnselectItem>Select</Dropdown.UnselectItem>
          <Dropdown.Item value={10}>ten</Dropdown.Item>
          <Dropdown.Item value={JSON.stringify({ a: 4, b: 4 })}>twenty</Dropdown.Item>
          <Dropdown.Item value={30}>thirty</Dropdown.Item>
          <Dropdown.Item value={301}>thirty2</Dropdown.Item>
          <Dropdown.Item value={302}>thirty3</Dropdown.Item>
          <Dropdown.Item value={3043}>thirty4</Dropdown.Item>
          <Dropdown.Item value={304} selected>
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
        <Dropdown name="item" isSearchable>
          <Dropdown.EmptyItem selected>No options</Dropdown.EmptyItem>
          <Dropdown.UnselectItem>Select</Dropdown.UnselectItem>
          <Dropdown.Item value={10}>ten</Dropdown.Item>
          <Dropdown.Item value={JSON.stringify({ a: 4, b: 4 })}>twenty</Dropdown.Item>
          <Dropdown.Item value={30}>thirty</Dropdown.Item>
          <Dropdown.Item value={301}>thirty2</Dropdown.Item>
          <Dropdown.Item value={302}>thirty3</Dropdown.Item>
          <Dropdown.Item value={3043}>thirty4</Dropdown.Item>
          <Dropdown.Item value={304} selected>
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
        <Dropdown name="item" maxWidth={45} multiple onChange={(value, values) => console.log(value, values)}>
          <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
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
        <Dropdown name="item" isSearchable multiple onChange={(_, values) => setSelectedValues(values as number[])}>
          <Dropdown.Display>{(selectedValue) => selectedValue?.join('= ')}</Dropdown.Display>
          <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
          <Dropdown.Item value={10} jc="space-between">
            ten <CheckboxSvg checked={selectedValues.includes(10)} />
          </Dropdown.Item>
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
