import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Dropdown from '../../src/components/dropdown';
import Flex from '../../src/components/flex';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';

export default function DropdownPage() {
  const [selectedValue, setSelectedValue] = useState<number>(2);

  return (
    <Box>
      <PageHeader icon={ChevronDown} title="Dropdown" description="Use Dropdown component to choose option(s) from a list." />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import Dropdown from '@cronocode/react-box/components/dropdown';" />

          <Code label="Basic Dropdown" language="jsx">
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
            label="Controlled Dropdown"
            language="jsx"
            code={`const [selectedValue, setSelectedValue] = useState<number>(2);

<Dropdown value={selectedValue} onChange={(value) => setSelectedValue(value!)}>
  <Dropdown.Item value={1}>Option 1</Dropdown.Item>
  <Dropdown.Item value={2}>Option 2</Dropdown.Item>
  <Dropdown.Item value={3}>Option 3</Dropdown.Item>
</Dropdown>`}
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
            language="jsx"
            code={`<Dropdown>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>Option 1</Dropdown.Item>
  <Dropdown.Item value={2}>Option 2</Dropdown.Item>
</Dropdown>`}
          >
            <Dropdown>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>Option 1</Dropdown.Item>
              <Dropdown.Item value={2}>Option 2</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code
            label="Disabled"
            language="jsx"
            code={`<Dropdown disabled>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>Option 1</Dropdown.Item>
  <Dropdown.Item value={2}>Option 2</Dropdown.Item>
</Dropdown>`}
          >
            <Dropdown disabled>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>Option 1</Dropdown.Item>
              <Dropdown.Item value={2}>Option 2</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code
            label="Compact"
            language="jsx"
            code={`<Dropdown variant="compact">
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>Option 1</Dropdown.Item>
  <Dropdown.Item value={2}>Option 2</Dropdown.Item>
</Dropdown>`}
          >
            <Dropdown variant="compact">
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>Option 1</Dropdown.Item>
              <Dropdown.Item value={2}>Option 2</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code
            label="Searchable"
            language="jsx"
            code={`<Dropdown isSearchable>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>John Doe</Dropdown.Item>
  <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
  <Dropdown.Item value={3}>Alice</Dropdown.Item>
  <Dropdown.Item value={4}>Bob</Dropdown.Item>
</Dropdown>`}
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
            label="Searchable with Empty Item"
            language="jsx"
            code={`<Dropdown isSearchable>
  <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>John Doe</Dropdown.Item>
  <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
</Dropdown>`}
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
            label="Multiple Selection"
            language="jsx"
            code={`<Dropdown multiple>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>John Doe</Dropdown.Item>
  <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
  <Dropdown.Item value={3}>Alice</Dropdown.Item>
  <Dropdown.Item value={4}>Bob</Dropdown.Item>
</Dropdown>`}
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
            label="Multiple with Custom Display"
            language="jsx"
            code={`<Dropdown multiple>
  <Dropdown.Display>{(selectedValues) => selectedValues.join('+')}</Dropdown.Display>
  <Dropdown.Unselect>Select</Dropdown.Unselect>
  <Dropdown.Item value={1}>John Doe</Dropdown.Item>
  <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
</Dropdown>`}
          >
            <Dropdown multiple showCheckbox>
              <Dropdown.Display>{(selectedValues: number[]) => selectedValues.join('+')}</Dropdown.Display>
              <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
              <Dropdown.Unselect>Unselect All</Dropdown.Unselect>
              <Dropdown.SelectAll>Select All</Dropdown.SelectAll>
              <Dropdown.Item value={1}>John Doe</Dropdown.Item>
              <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
              <Dropdown.Item value={3}>Alice</Dropdown.Item>
              <Dropdown.Item value={4}>Bob</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code
            label="Select All / Unselect All"
            language="jsx"
            code={`<Dropdown multiple>
  <Dropdown.Unselect>Unselect All</Dropdown.Unselect>
  <Dropdown.SelectAll>Select All</Dropdown.SelectAll>
  <Dropdown.Item value={1}>John Doe</Dropdown.Item>
  <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
</Dropdown>`}
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
        </Flex>
      </motion.div>
    </Box>
  );
}
