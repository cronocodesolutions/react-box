import Box from '../../src/box';
import DataGrid from '../../src/components/dataGrid';
import { GridDefinition } from '../../src/components/dataGrid/contracts/dataGridContract';
import Data from '../data/MOCK_DATA.json';
import Data1 from '../data/MOCK_DATA_1.json';
import Data2 from '../data/MOCK_DATA_2.json';
import Data3 from '../data/MOCK_DATA_3.json';
import Data4 from '../data/MOCK_DATA_4.json';
import Data5 from '../data/MOCK_DATA_5.json';
import Data6 from '../data/MOCK_DATA_6.json';
import Data7 from '../data/MOCK_DATA_7.json';
import usePageContext from '../hooks/usePageContext';
import { H3 } from '../../src/components/semantics';
import { useMemo } from 'react';

interface DataType {
  first_name: string;
  last_name: string;
  age: number;
  email: string;
  country: string;
  favorite_color: string;
  gender: string;
  job_title: string;
  ssn: string;
  birthdate: string;
  phone_number: string;
  street_address: string;
  city: string;
  username: string;
  credit_card_number: string;
  salary: number;
  company_name: string;
  language: string;
  currency_code: string;
}

const datata = [...Data, ...Data1, ...Data2, ...Data3, ...Data4, ...Data5, ...Data6, ...Data7];

export default function DataGridPage() {
  usePageContext(<RightSidebar />);

  var def: GridDefinition<DataType> = {
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
  };

  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        DataGrid (⚠️ WIP)
      </Box>

      <DataGrid data={datata} def={def} onSelectionChange={(e) => console.log(e)} />
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
