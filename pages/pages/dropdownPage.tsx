import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Dropdown from '../../src/components/dropdown';
import Flex from '../../src/components/flex';
import Select from '../../src/components/select';
import { H3, Link } from '../../src/components/semantics';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import usePageContext from '../hooks/usePageContext';

Box.components({
  dropdown: {
    variants: {
      outlined: {
        bgColor: 'transparent',
        b: 2,
        borderColor: 'indigo-500',
        color: 'indigo-600',
        theme: { dark: { borderColor: 'indigo-400', color: 'indigo-300' } },
      },
    },
    children: {
      item: {
        variants: {
          outlined: {
            hover: { bgColor: 'indigo-50' },
            selected: { bgColor: 'indigo-100', color: 'indigo-700' },
            theme: { dark: { hover: { bgColor: 'indigo-950' }, selected: { bgColor: 'indigo-900', color: 'indigo-200' } } },
          },
        },
      },
      items: {
        variants: {
          outlined: { b: 2, borderColor: 'indigo-500', theme: { dark: { borderColor: 'indigo-400' } } },
        },
      },
    },
  },
});

interface User {
  id: number;
  name: string;
  role: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', role: 'Admin' },
  { id: 2, name: 'Joe Smith', role: 'Editor' },
  { id: 3, name: 'Alice Brown', role: 'Viewer' },
  { id: 4, name: 'Bob Wilson', role: 'Editor' },
];

export default function DropdownPage() {
  usePageContext(<RightSidebar />);
  const [selectedValue, setSelectedValue] = useState<number>(2);

  return (
    <Box>
      <PageHeader icon={ChevronDown} title="Dropdown" description="Use Dropdown component to choose option(s) from a list." />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import Dropdown from '@cronocode/react-box/components/dropdown';" />

          <Code id="basic" label="Basic Dropdown" language="jsx">
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
            id="controlled"
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
            id="unselect"
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

          <Code id="disabled" label="Disabled" language="jsx">
            <Dropdown disabled width={50}>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>Option 1</Dropdown.Item>
              <Dropdown.Item value={2}>Option 2</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code id="compact" label="Compact" language="jsx">
            <Dropdown variant="compact" width={40}>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>Option 1</Dropdown.Item>
              <Dropdown.Item value={2}>Option 2</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code
            id="variant"
            label="Custom Variant (outlined)"
            language="jsx"
            code={`// Register variant via Box.components()
Box.components({
  dropdown: {
    variants: {
      outlined: {
        bgColor: 'transparent', b: 2, borderColor: 'indigo-500', color: 'indigo-600',
      },
    },
    children: {
      item: { variants: { outlined: { hover: { bgColor: 'indigo-50' }, selected: { bgColor: 'indigo-100' } } } },
      items: { variants: { outlined: { b: 2, borderColor: 'indigo-500' } } },
    },
  },
});

// Use — variant propagates to all children automatically
<Dropdown variant="outlined">
  <Dropdown.Item value={1}>Option 1</Dropdown.Item>
  <Dropdown.Item value={2}>Option 2</Dropdown.Item>
</Dropdown>`}
          >
            <Dropdown variant={'outlined' as never} defaultValue={1} width={50}>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>Option 1</Dropdown.Item>
              <Dropdown.Item value={2}>Option 2</Dropdown.Item>
              <Dropdown.Item value={3}>Option 3</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code id="searchable" label="Searchable" language="jsx">
            <Dropdown isSearchable width={50}>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>John Doe</Dropdown.Item>
              <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
              <Dropdown.Item value={3}>Alice</Dropdown.Item>
              <Dropdown.Item value={4}>Bob</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code id="empty-item" label="Searchable with Empty Item" language="jsx">
            <Dropdown isSearchable width={50}>
              <Dropdown.EmptyItem>No options</Dropdown.EmptyItem>
              <Dropdown.Unselect>Select</Dropdown.Unselect>
              <Dropdown.Item value={1}>John Doe</Dropdown.Item>
              <Dropdown.Item value={2}>Joe Smith</Dropdown.Item>
              <Dropdown.Item value={3}>Alice</Dropdown.Item>
              <Dropdown.Item value={4}>Bob</Dropdown.Item>
            </Dropdown>
          </Code>

          <Code id="multiple" label="Multiple Selection" language="jsx">
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

          <Code id="checkboxes" label="Multiple Selection with Checkboxes" language="jsx">
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

          <Code id="custom-display" label="Multiple with Custom Display" language="jsx">
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

          {/* Select Component Section */}
          <Box id="select" mt={8} pt={8} bt={1} borderColor="gray-200" theme={{ dark: { borderColor: 'gray-700' } }}>
            <H3 fontSize={24} fontWeight={700} mb={2}>
              Select
            </H3>
            <Box fontSize={14} color="gray-500" mb={8}>
              Data-driven dropdown — pass data + def instead of composing children. Wraps Dropdown internally.
            </Box>

            <Flex d="column" gap={8}>
              <Code label="Import" language="jsx" code="import Select from '@cronocode/react-box/components/select';" />

              <Code
                id="select-basic"
                label="Basic Select"
                language="jsx"
                code={`const users = [
  { id: 1, name: 'John Doe', role: 'Admin' },
  { id: 2, name: 'Joe Smith', role: 'Editor' },
  { id: 3, name: 'Alice Brown', role: 'Viewer' },
];

<Select
  data={users}
  def={{ valueKey: 'id', displayKey: 'name', placeholder: 'Pick a user...' }}
  width={50}
/>`}
              >
                <Select<User, number> data={users} def={{ valueKey: 'id', displayKey: 'name', placeholder: 'Pick a user...' }} width={50} />
              </Code>

              <Code
                id="select-display"
                label="Custom Item Display"
                language="jsx"
                code={`<Select
  data={users}
  def={{
    valueKey: 'id',
    display: (user) => \`\${user.name} — \${user.role}\`,
    placeholder: 'Pick a user...',
  }}
/>`}
              >
                <Select<User, number>
                  data={users}
                  def={{
                    valueKey: 'id',
                    display: (user) => `${user.name} — ${user.role}`,
                    placeholder: 'Pick a user...',
                  }}
                  width={50}
                />
              </Code>

              <Code
                id="select-multiple"
                label="Multiple with Search"
                language="jsx"
                code={`<Select
  data={users}
  def={{
    valueKey: 'id',
    displayKey: 'name',
    placeholder: 'Pick users...',
    selectAllText: 'Select all',
    emptyText: 'No users found',
    selectedDisplay: (rows) =>
      rows.length === 0 ? 'Pick users...' : \`\${rows.length} selected\`,
  }}
  multiple showCheckbox isSearchable searchPlaceholder="Search users..."
/>`}
              >
                <Select<User, number>
                  data={users}
                  def={{
                    valueKey: 'id',
                    displayKey: 'name',
                    placeholder: 'Pick users...',
                    selectAllText: 'Select all',
                    emptyText: 'No users found',
                    selectedDisplay: (rows) => (rows.length === 0 ? 'Pick users...' : `${rows.length} selected`),
                  }}
                  multiple
                  showCheckbox
                  isSearchable
                  searchPlaceholder="Search users..."
                  width={50}
                />
              </Code>
            </Flex>
          </Box>
        </Flex>
      </motion.div>
    </Box>
  );
}

const sidebarLinks = [
  { label: 'Dropdown', section: true },
  { id: 'basic', label: 'Basic' },
  { id: 'controlled', label: 'Controlled' },
  { id: 'unselect', label: 'Unselect Item' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'compact', label: 'Compact' },
  { id: 'variant', label: 'Custom Variant' },
  { id: 'searchable', label: 'Searchable' },
  { id: 'empty-item', label: 'Empty Item' },
  { id: 'multiple', label: 'Multiple' },
  { id: 'checkboxes', label: 'Checkboxes' },
  { id: 'custom-display', label: 'Custom Display' },
  { label: 'Select', section: true },
  { id: 'select-basic', label: 'Basic' },
  { id: 'select-display', label: 'Custom Display' },
  { id: 'select-multiple', label: 'Multiple + Search' },
] as const;

function RightSidebar() {
  return (
    <Flex d="column" gap={1} pt={10}>
      {sidebarLinks.map((link) =>
        'section' in link ? (
          <Box
            key={link.label}
            fontSize={11}
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing={1}
            mt={4}
            mb={1}
            theme={{ dark: { color: 'slate-500' }, light: { color: 'slate-400' } }}
          >
            {link.label}
          </Box>
        ) : (
          <Link
            key={link.id}
            props={{ href: `#${link.id}` }}
            fontSize={13}
            py={1}
            px={2}
            borderRadius={1}
            textDecoration="none"
            theme={{
              dark: { color: 'slate-400', hover: { color: 'white', bgColor: 'slate-800' } },
              light: { color: 'slate-600', hover: { color: 'slate-900', bgColor: 'slate-100' } },
            }}
          >
            {link.label}
          </Link>
        ),
      )}
    </Flex>
  );
}
