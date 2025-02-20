import Box from '../../src/box';
import DataGrid from '../../src/components/dataGrid';
import DataGrid2 from '../../src/components/dataGrid2';
import { GridDefinition } from '../../src/components/dataGrid/dataGridContract';
import Data from '../data/MOCK_DATA.json';
import Data1 from '../data/MOCK_DATA_1.json';
import Data2 from '../data/MOCK_DATA_2.json';
import Data3 from '../data/MOCK_DATA_3.json';
import Data4 from '../data/MOCK_DATA_4.json';
import Data5 from '../data/MOCK_DATA_5.json';
import Data6 from '../data/MOCK_DATA_6.json';
import Data7 from '../data/MOCK_DATA_7.json';

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
  var def: GridDefinition<DataType> = {
    pagination: true,
    columns: [
      { key: 'person', columns: [{ key: 'first_name' }, { key: 'last_name' }] },
      { key: 'person2', columns: [{ key: 'age' }, { key: 'email' }] },
      {
        key: 'test',
        columns: [
          { key: 'test_single', columns: [{ key: 'job_title' }] },
          { key: 'test_double', columns: [{ key: 'street_address' }, { key: 'city' }] },
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
  };

  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        DataGrid
      </Box>

      <DataGrid data={datata} def={def} />

      <DataGrid2 data={Data} def={def} mt={10} />
    </Box>
  );
}
