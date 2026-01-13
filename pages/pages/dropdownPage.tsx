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
            <Dropdown defaultValue={1} props={{ role: 'combobox' }} width={50}>
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
              <Dropdown value={selectedValue} onChange={(value) => setSelectedValue(value!)} width={50}>
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
            <Dropdown width={50}>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>Option 1</Dropdown.Item>
              <Dropdown.Item value={2}>Option 2</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code label="Disabled" language="jsx">
            <Dropdown disabled width={50}>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>Option 1</Dropdown.Item>
              <Dropdown.Item value={2}>Option 2</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code label="Compact" language="jsx">
            <Dropdown variant="compact" width={40}>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>Option 1</Dropdown.Item>
              <Dropdown.Item value={2}>Option 2</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code label="Searchable" language="jsx">
            <Dropdown isSearchable width={50}>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>John Doe</Dropdown.Item>
              <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
              <Dropdown.Item value={3}>Alice</Dropdown.Item>
              <Dropdown.Item value={4}>Bob</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code label="Searchable with Empty Item" language="jsx">
            <Dropdown isSearchable width={50}>
              <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>John Doe</Dropdown.Item>
              <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
              <Dropdown.Item value={3}>Alice</Dropdown.Item>
              <Dropdown.Item value={4}>Bob</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code label="Multiple Selection" language="jsx">
            <Dropdown multiple width={50}>
              <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
              <Dropdown.Unselect>Unselect All</Dropdown.Unselect>
              <Dropdown.SelectAll>Select All</Dropdown.SelectAll>
              <Dropdown.Item value={1}>John Doe</Dropdown.Item>
              <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
              <Dropdown.Item value={3}>Alice</Dropdown.Item>
              <Dropdown.Item value={4}>Bob</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code label="Multiple Selection with Checkboxes" language="jsx">
            <Dropdown multiple showCheckbox width={50}>
              <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
              <Dropdown.Unselect>Unselect All</Dropdown.Unselect>
              <Dropdown.SelectAll>Select All</Dropdown.SelectAll>
              <Dropdown.Item value={1}>John Doe</Dropdown.Item>
              <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
              <Dropdown.Item value={3}>Alice</Dropdown.Item>
              <Dropdown.Item value={4}>Bob</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code label="Multiple with Custom Display" language="jsx">
            <Dropdown multiple showCheckbox width={50}>
              <Dropdown.Display>{(selectedValues: number[]) => <Box height={16}>{selectedValues.join('+')}</Box>}</Dropdown.Display>
              <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
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
