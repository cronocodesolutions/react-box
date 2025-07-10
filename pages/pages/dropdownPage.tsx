import { useState } from 'react';
import Box from '../../src/box';
import Dropdown from '../../src/components/dropdown';
import Code from '../components/code';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';

export default function DropdownPage() {
  const [selectedValue, setSelectedValue] = useState<number>(2);

  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Dropdown
      </Box>

      <Box tag="h4" fontSize={18} fontWeight={400} mb={10}>
        Use Dropdown component in order to choose an option(s) from the list
      </Box>

      <Code label="Import" code="import Dropdown from '@cronocode/react-box/components/dropdown';" />

      <Code
        label="Basic Dropdown"
        code={`<Dropdown defaultValue={1}>
  <Dropdown.Item value={1}>Option 1</Dropdown.Item>
  <Dropdown.Item value={2}>Option 2</Dropdown.Item>
</Dropdown>`}
        mt={10}
      >
        <Dropdown defaultValue={1} props={{ role: 'combobox' }}>
          <Dropdown.Item value={1} props={{ role: 'option' }}>
            Option 1
          </Dropdown.Item>
          <Dropdown.Item value={2} props={{ role: 'option' }}>
            Option 2
          </Dropdown.Item>
          {[3, 4].map((x) => (
            <Dropdown.Item value={x} key={x} props={{ role: 'option' }}>
              Option {x}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </Code>

      <Code
        label="Basic Dropdown"
        code={`const [selectedValue, setSelectedValue] = useState<number>(2);

<Dropdown value={1} onChange={(value) => setSelectedValue(value)>
  <Dropdown.Item value={1}>Option 1</Dropdown.Item>
  <Dropdown.Item value={2}>Option 2</Dropdown.Item>
  <Dropdown.Item value={3}>Option 3</Dropdown.Item>
</Dropdown>`}
        mt={10}
      >
        <Flex gap={4}>
          <Dropdown value={selectedValue} onChange={(value) => setSelectedValue(value!)}>
            <Dropdown.Item value={1}>Option 1</Dropdown.Item>
            <Dropdown.Item value={2}>Option 2</Dropdown.Item>
            <Dropdown.Item value={3}>Option 3</Dropdown.Item>
          </Dropdown>

          <Button onClick={() => setSelectedValue(3)}>Select option 3</Button>
        </Flex>
      </Code>

      <Code
        label="Unselect Item"
        code={`<Dropdown>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>Option 1</Dropdown.Item>
  <Dropdown.Item value={2}>Option 2</Dropdown.Item>
</Dropdown>`}
        mt={10}
      >
        <Dropdown>
          <Dropdown.Unselect>Select</Dropdown.Unselect>
          <Dropdown.Item value={1}>Option 1</Dropdown.Item>
          <Dropdown.Item value={2}>Option 2</Dropdown.Item>
        </Dropdown>
      </Code>

      <Code
        label="Disabled"
        code={`<Dropdown disabled>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>Option 1</Dropdown.Item>
  <Dropdown.Item value={2}>Option 2</Dropdown.Item>
</Dropdown>`}
        mt={10}
      >
        <Dropdown disabled>
          <Dropdown.Unselect>Select</Dropdown.Unselect>
          <Dropdown.Item value={1}>Option 1</Dropdown.Item>
          <Dropdown.Item value={2}>Option 2</Dropdown.Item>
        </Dropdown>
      </Code>

      <Code
        label="Searchable"
        code={`<Dropdown isSearchable>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>John Doe</Dropdown.Item>
  <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
  <Dropdown.Item value={3}>Alice</Dropdown.Item>
  <Dropdown.Item value={4}>Bob</Dropdown.Item>
</Dropdown>`}
        mt={10}
      >
        <Dropdown isSearchable>
          <Dropdown.Unselect>Select</Dropdown.Unselect>
          <Dropdown.Item value={1}>John Doe</Dropdown.Item>
          <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
          <Dropdown.Item value={3}>Alice</Dropdown.Item>
          <Dropdown.Item value={4}>Bob</Dropdown.Item>
        </Dropdown>
      </Code>

      <Code
        label="Searchable with no options item"
        code={`<Dropdown isSearchable>
  <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>John Doe</Dropdown.Item>
  <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
  <Dropdown.Item value={3}>Alice</Dropdown.Item>
  <Dropdown.Item value={4}>Bob</Dropdown.Item>
</Dropdown>`}
        mt={10}
      >
        <Dropdown isSearchable>
          <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
          <Dropdown.Unselect>Select</Dropdown.Unselect>
          <Dropdown.Item value={1}>John Doe</Dropdown.Item>
          <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
          <Dropdown.Item value={3}>Alice</Dropdown.Item>
          <Dropdown.Item value={4}>Bob</Dropdown.Item>
        </Dropdown>
      </Code>

      <Code
        label="Multiple items selection"
        code={`<Dropdown multiple>
  <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>John Doe</Dropdown.Item>
  <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
  <Dropdown.Item value={3}>Alice</Dropdown.Item>
  <Dropdown.Item value={4}>Bob</Dropdown.Item>
</Dropdown>`}
        mt={10}
      >
        <Dropdown multiple>
          <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
          <Dropdown.Unselect>Select</Dropdown.Unselect>
          <Dropdown.Item value={1}>John Doe</Dropdown.Item>
          <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
          <Dropdown.Item value={3}>Alice</Dropdown.Item>
          <Dropdown.Item value={4}>Bob</Dropdown.Item>
        </Dropdown>
      </Code>

      <Code
        label="Multiple items selection custom display"
        code={`<Dropdown multiple>
  <Dropdown.Display>{(selectedValues) => selectedValues.join('+')}</Dropdown.Display>
  <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>John Doe</Dropdown.Item>
  <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
  <Dropdown.Item value={3}>Alice</Dropdown.Item>
  <Dropdown.Item value={4}>Bob</Dropdown.Item>
</Dropdown>`}
        mt={10}
      >
        <Dropdown multiple>
          <Dropdown.Display>{(selectedValues: number[]) => selectedValues.join('+')}</Dropdown.Display>
          <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
          <Dropdown.Unselect>Select</Dropdown.Unselect>
          <Dropdown.Item value={1}>John Doe</Dropdown.Item>
          <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
          <Dropdown.Item value={3}>Alice</Dropdown.Item>
          <Dropdown.Item value={4}>Bob</Dropdown.Item>
        </Dropdown>
      </Code>

      <Code
        label="Multiple items select all/unselect all"
        code={`<Dropdown multiple>
  <Dropdown.Unselect>Unselect All</Dropdown.Unselect>
  <Dropdown.SelectAll>Select All</Dropdown.SelectAll>
  <Dropdown.Item value={1}>John Doe</Dropdown.Item>
  <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
  <Dropdown.Item value={3}>Alice</Dropdown.Item>
  <Dropdown.Item value={4}>Bob</Dropdown.Item>
</Dropdown>`}
        mt={10}
      >
        <Dropdown multiple>
          <Dropdown.Unselect>Unselect All</Dropdown.Unselect>
          <Dropdown.SelectAll>Select All</Dropdown.SelectAll>
          <Dropdown.Item value={1}>John Doe</Dropdown.Item>
          <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
          <Dropdown.Item value={3}>Alice</Dropdown.Item>
          <Dropdown.Item value={4}>Bob</Dropdown.Item>
        </Dropdown>
      </Code>
    </Box>
  );
}
