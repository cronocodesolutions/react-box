import { motion } from 'framer-motion';
import { Filter, Table, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import DataGrid from '../../src/components/dataGrid';
import Flex from '../../src/components/flex';
import { H3 } from '../../src/components/semantics';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import Data from '../data/MOCK_DATA.json';
import Data1 from '../data/MOCK_DATA_1.json';
import Data2 from '../data/MOCK_DATA_2.json';
import Data3 from '../data/MOCK_DATA_3.json';
import Data4 from '../data/MOCK_DATA_4.json';
import Data5 from '../data/MOCK_DATA_5.json';
import Data6 from '../data/MOCK_DATA_6.json';
import Data7 from '../data/MOCK_DATA_7.json';
import usePageContext from '../hooks/usePageContext';

const allData = [...Data, ...Data1, ...Data2, ...Data3, ...Data4, ...Data5, ...Data6, ...Data7];

// Filter chip component
function FilterChip({ label, active, onClick, onClear }: { label: string; active: boolean; onClick: () => void; onClear?: () => void }) {
  return (
    <Button
      ai="center"
      gap={1}
      px={3}
      py={1}
      borderRadius={16}
      fontSize={13}
      fontWeight={500}
      cursor="pointer"
      b={1}
      bgColor={active ? 'blue-50' : 'transparent'}
      borderColor={active ? 'blue-300' : 'gray-300'}
      color={active ? 'blue-700' : 'gray-600'}
      hover={{
        bgColor: active ? 'blue-100' : 'gray-50',
        borderColor: active ? 'blue-400' : 'gray-400',
      }}
      theme={{
        dark: {
          bgColor: active ? 'blue-900' : 'transparent',
          borderColor: active ? 'blue-600' : 'gray-600',
          color: active ? 'blue-300' : 'gray-400',
          hover: {
            bgColor: active ? 'blue-800' : 'gray-800',
          },
        },
      }}
      onClick={onClick}
    >
      {label}
      {active && onClear && (
        <Box
          ml={1}
          p={0.5}
          borderRadius={10}
          hover={{ bgColor: 'blue-200' }}
          theme={{ dark: { hover: { bgColor: 'blue-700' } } }}
          props={{
            onClick: (e) => {
              e.stopPropagation();
              onClear();
            },
          }}
        >
          <X size={12} />
        </Box>
      )}
    </Button>
  );
}

// Custom TopBar Filter component
function CustomTopBarFilter({
  genderFilter,
  setGenderFilter,
  ageFilter,
  setAgeFilter,
}: {
  genderFilter: string | null;
  setGenderFilter: (v: string | null) => void;
  ageFilter: string | null;
  setAgeFilter: (v: string | null) => void;
}) {
  const hasFilters = genderFilter || ageFilter;

  return (
    <Flex ai="center" gap={2} flexWrap="wrap">
      <Flex ai="center" gap={1} color="gray-500" theme={{ dark: { color: 'gray-400' } }}>
        <Filter size={14} />
        <Box fontSize={13}>Quick filters:</Box>
      </Flex>

      {/* Gender filters */}
      <FilterChip
        label="Male"
        active={genderFilter === 'Male'}
        onClick={() => setGenderFilter(genderFilter === 'Male' ? null : 'Male')}
        onClear={() => setGenderFilter(null)}
      />
      <FilterChip
        label="Female"
        active={genderFilter === 'Female'}
        onClick={() => setGenderFilter(genderFilter === 'Female' ? null : 'Female')}
        onClear={() => setGenderFilter(null)}
      />

      <Box width={1} height={4} bgColor="gray-300" theme={{ dark: { bgColor: 'gray-600' } }} />

      {/* Age filters */}
      <FilterChip
        label="Under 30"
        active={ageFilter === 'under30'}
        onClick={() => setAgeFilter(ageFilter === 'under30' ? null : 'under30')}
        onClear={() => setAgeFilter(null)}
      />
      <FilterChip
        label="30-50"
        active={ageFilter === '30to50'}
        onClick={() => setAgeFilter(ageFilter === '30to50' ? null : '30to50')}
        onClear={() => setAgeFilter(null)}
      />
      <FilterChip
        label="Over 200"
        active={ageFilter === 'over200'}
        onClick={() => setAgeFilter(ageFilter === 'over200' ? null : 'over200')}
        onClear={() => setAgeFilter(null)}
      />

      {/* Clear all */}
      {hasFilters && (
        <Button
          px={2}
          py={1}
          fontSize={12}
          bgColor="transparent"
          color="red-500"
          hover={{ bgColor: 'red-50' }}
          theme={{ dark: { hover: { bgColor: 'red-900' } } }}
          onClick={() => {
            setGenderFilter(null);
            setAgeFilter(null);
          }}
        >
          Clear all
        </Button>
      )}
    </Flex>
  );
}

export default function DataGridPage() {
  usePageContext(<RightSidebar />);

  // Custom filter state for the first DataGrid
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [ageFilter, setAgeFilter] = useState<string | null>(null);

  // Apply custom filters
  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      if (genderFilter && row.gender !== genderFilter) return false;
      if (ageFilter === 'under30' && row.age >= 30) return false;
      if (ageFilter === '30to50' && (row.age < 30 || row.age > 50)) return false;
      if (ageFilter === 'over200' && row.age <= 200) return false;
      return true;
    });
  }, [genderFilter, ageFilter]);

  return (
    <Box>
      <PageHeader
        icon={Table}
        title="DataGrid"
        description="A powerful data grid component with sorting, filtering, and custom cells. (Work in Progress)"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import DataGrid from '@cronocode/react-box/components/dataGrid';" />

          <Code
            label="Full Featured DataGrid"
            language="jsx"
            code={`<DataGrid
  data={filteredData}
  def={{
    title: 'All Features Demo',
    topBar: true,
    bottomBar: true,
    globalFilter: true,
    topBarContent: <CustomTopBarFilter ... />,
    rowSelection: { pinned: true },
    showRowNumber: { pinned: true },
    rowHeight: 40,
    visibleRowsCount: 8,
    columns: [...],
  }}
/>`}
          >
            <DataGrid
              data={filteredData}
              def={{
                title: 'All Features Demo',
                topBar: true,
                bottomBar: true,
                globalFilter: true,
                topBarContent: (
                  <CustomTopBarFilter
                    genderFilter={genderFilter}
                    setGenderFilter={setGenderFilter}
                    ageFilter={ageFilter}
                    setAgeFilter={setAgeFilter}
                  />
                ),
                rowSelection: { pinned: true },
                showRowNumber: { pinned: true },
                rowHeight: 40,
                visibleRowsCount: 8,
                sortable: true,
                resizable: true,
                noDataComponent: (
                  <Flex d="column" ai="center" gap={3} p={8} color="gray-500" theme={{ dark: { color: 'gray-400' } }}>
                    <Filter size={32} />
                    <Box>No records match your filters</Box>
                    <Button
                      px={3}
                      py={1}
                      fontSize={13}
                      bgColor="blue-500"
                      color="white"
                      borderRadius={6}
                      hover={{ bgColor: 'blue-600' }}
                      onClick={() => {
                        setGenderFilter(null);
                        setAgeFilter(null);
                      }}
                    >
                      Clear filters
                    </Button>
                  </Flex>
                ),
                columns: [
                  {
                    key: 'personal',
                    header: 'Personal Info',
                    columns: [
                      { key: 'first_name', header: 'First Name', filterable: true },
                      { key: 'last_name', header: 'Last Name', filterable: true },
                      { key: 'age', header: 'Age', width: 120, align: 'right', filterable: { type: 'number' } },
                    ],
                  },
                  {
                    key: 'contact',
                    header: 'Contact',
                    columns: [
                      { key: 'email', header: 'Email', width: 280, filterable: true },
                      { key: 'phone_number', header: 'Phone', width: 160 },
                    ],
                  },
                  { key: 'country', header: 'Country', filterable: { type: 'multiselect' } },
                  { key: 'gender', header: 'Gender', width: 120, filterable: { type: 'multiselect' } },
                  { key: 'city', header: 'City', pin: 'RIGHT' },
                ],
              }}
            />
          </Code>

          <Code
            label="Basic DataGrid"
            language="jsx"
            code={`<DataGrid
  data={data}
  def={{
    columns: [
      { key: 'first_name', header: 'First name' },
      { key: 'last_name', header: 'Last name' },
      {
        key: 'age',
        header: 'Age',
        width: 90,
        align: 'right',
        Cell: ({ cell }) => {
          // better to define this function outside to avoid re-creation on each render
          return (
            <Flex
              bgColor="violet-50"
              height="fit"
              width="fit"
              ai="center"
              jc="center"
              overflow="hidden"
              className="parent"
              theme={{ dark: { bgColor: 'violet-600' } }}
            >
              <Box
                px={4}
                textOverflow="ellipsis"
                overflow="hidden"
                textWrap="nowrap"
                color="violet-700"
                fontWeight={600}
                hoverGroup={{ parent: { rotate: 180 } }}
                theme={{ dark: { color: 'violet-300' } }}
              >
                {cell.row.data.age}
              </Box>
            </Flex>
          );
        },
      },
      { key: 'email', header: 'Email', width: 300 },
      { key: 'street_address' },
      { key: 'city' },
      { key: 'country' },
      { key: 'favorite_color' },
      { key: 'gender' },
      { key: 'ssn' },
      { key: 'birthdate' },
      { key: 'phone_number' },
      { key: 'username' },
      { key: 'credit_card_number' },
      { key: 'salary' },
      { key: 'company_name' },
      { key: 'language' },
      { key: 'currency_code' },
    ],
    rowHeight: 40,
    visibleRowsCount: 5,
  }}
/>`}
          >
            <DataGrid
              data={allData}
              def={{
                columns: [
                  { key: 'first_name', header: 'First name' },
                  { key: 'last_name', header: 'Last name' },
                  {
                    key: 'age',
                    header: 'Age',
                    width: 90,
                    align: 'right',
                    Cell: ({ cell }) => {
                      // You can define this function outside the component to avoid re-creation on each render
                      return (
                        <Flex
                          bgColor="violet-50"
                          height="fit"
                          width="fit"
                          ai="center"
                          jc="center"
                          overflow="hidden"
                          className="parent"
                          theme={{ dark: { bgColor: 'violet-600' } }}
                        >
                          <Box
                            px={4}
                            textOverflow="ellipsis"
                            overflow="hidden"
                            textWrap="nowrap"
                            color="violet-700"
                            fontWeight={600}
                            hoverGroup={{ parent: { rotate: 180 } }}
                            theme={{ dark: { color: 'violet-300' } }}
                          >
                            {cell.row.data.age}
                          </Box>
                        </Flex>
                      );
                    },
                  },
                  { key: 'email', header: 'Email', width: 300 },
                  { key: 'street_address' },
                  { key: 'city' },
                  { key: 'country' },
                  { key: 'favorite_color' },
                  { key: 'gender' },
                  { key: 'ssn' },
                  { key: 'birthdate' },
                  { key: 'phone_number' },
                  { key: 'username' },
                  { key: 'credit_card_number' },
                  { key: 'salary' },
                  { key: 'company_name' },
                  { key: 'language' },
                  { key: 'currency_code' },
                ],
                rowHeight: 40,
                visibleRowsCount: 5,
              }}
            />
          </Code>

          <Code
            label="DataGrid with Global Filter and Column Filters"
            language="jsx"
            code={`<DataGrid
  data={data}
  def={{
    columns: [
      { key: 'first_name', header: 'First name', filterable: true },
      { key: 'last_name', header: 'Last name', filterable: true },
      { key: 'age', header: 'Age', width: 120, align: 'right', filterable: { type: 'number' } },
      { key: 'email', header: 'Email', width: 300, filterable: true },
      { key: 'country', filterable: { type: 'multiselect' } },
      { key: 'gender', filterable: { type: 'multiselect' } },
    ],
    rowHeight: 40,
    visibleRowsCount: 8,
    topBar: true,
    bottomBar: true,
    globalFilter: true,
  }}
/>`}
          >
            <DataGrid
              data={allData}
              def={{
                columns: [
                  { key: 'first_name', header: 'First name', filterable: true },
                  { key: 'last_name', header: 'Last name', filterable: true },
                  { key: 'age', header: 'Age', width: 140, align: 'right', filterable: { type: 'number' } },
                  { key: 'email', header: 'Email', width: 300, filterable: true },
                  { key: 'country', filterable: { type: 'multiselect' } },
                  { key: 'gender', filterable: { type: 'multiselect' } },
                ],
                rowHeight: 40,
                visibleRowsCount: 8,
                topBar: true,
                bottomBar: true,
                globalFilter: true,
              }}
            />
          </Code>

          <Code
            label="Grouped Columns with Row Selection"
            language="jsx"
            code={`<DataGrid
  data={data}
  def={{
    columns: [
      {
        key: 'person',
        header: 'Person',
        columns: [
          { key: 'first_name', header: 'First name' },
          { key: 'last_name', header: 'Last name' },
        ],
      },
      {
        key: 'contact',
        header: 'Contact',
        columns: [
          { key: 'email', header: 'Email', width: 300 },
          { key: 'phone_number', header: 'Phone' },
        ],
      },
      { key: 'country' },
      { key: 'city' },
    ],
    rowSelection: { pinned: true },
    showRowNumber: { pinned: true },
  }}
/>`}
          >
            <DataGrid
              data={allData}
              def={{
                topBar: true,
                title: 'Users Table',
                columns: [
                  {
                    key: 'person',
                    header: 'Person',
                    columns: [
                      { key: 'first_name', header: 'First name' },
                      { key: 'last_name', header: 'Last name' },
                    ],
                  },
                  {
                    key: 'person2',
                    header: 'Person 2',
                    columns: [
                      { key: 'age', header: 'Age', width: 120 },
                      { key: 'email', header: 'Email', width: 300 },
                    ],
                  },
                  {
                    key: 'test',
                    header: 'Test',
                    columns: [
                      { key: 'test_single', columns: [{ key: 'job_title' }] },
                      { key: 'test_double', header: 'Test double', columns: [{ key: 'street_address' }, { key: 'city' }] },
                    ],
                  },
                  { key: 'country' },
                  { key: 'favorite_color' },
                  { key: 'gender' },
                  { key: 'ssn' },
                  { key: 'birthdate' },
                  { key: 'phone_number' },
                  { key: 'username' },
                  { key: 'credit_card_number' },
                  { key: 'salary' },
                  { key: 'company_name' },
                  { key: 'language' },
                  { key: 'currency_code' },
                ],
                rowSelection: { pinned: true },
                showRowNumber: { pinned: true },
              }}
            />
          </Code>

          <Code
            label="Disable Sorting and Resizing"
            language="jsx"
            code={`<DataGrid
  data={data}
  def={{
    columns: [
      { key: 'first_name', header: 'First name' },
      { key: 'last_name', header: 'Last name' },
      { key: 'age', header: 'Age', width: 100, sortable: true }, // Override: sortable
      { key: 'email', header: 'Email', width: 300, resizable: true }, // Override: resizable
      { key: 'country' },
      { key: 'city' },
    ],
    rowHeight: 40,
    visibleRowsCount: 5,
    sortable: false,   // Disable sorting globally
    resizable: false,  // Disable resizing globally
  }}
/>`}
          >
            <DataGrid
              data={allData}
              def={{
                columns: [
                  { key: 'first_name', header: 'First name' },
                  { key: 'last_name', header: 'Last name' },
                  { key: 'age', header: 'Age', width: 100, sortable: true },
                  { key: 'email', header: 'Email', width: 300, resizable: true },
                  { key: 'country' },
                  { key: 'city' },
                ],
                rowHeight: 40,
                visibleRowsCount: 5,
                sortable: false,
                resizable: false,
              }}
            />
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}

function RightSidebar() {
  return (
    <Box pt={10}>
      <H3 mb={2}>Columns</H3>
      <Box pl={4}>
        <Box>Column definition</Box>
        <Box>Column definition</Box>
        <Box>Column definition</Box>
      </Box>
    </Box>
  );
}
