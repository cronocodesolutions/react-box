import Box from '../../src/box';
import DataGrid from '../../src/components/dataGrid';
import { GridDefinition } from '../../src/components/dataGrid/dataGridContract';
import Grid from '../../src/components/grid';
import Data from '../data/MOCK_DATA.json';

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

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  day: number;
  month: number;
  year: number;
  visits: number;
  status: string;
  progress: number;
}

const data: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'super',
    lastName: 'user',
    age: 38,
    visits: 76,
    status: 'In Relationship',
    progress: 59,
    day: 0,
    month: 0,
    year: 0,
  },
  {
    firstName: 'Jackie',
    lastName: 'Chan',
    age: 62,
    visits: 3002,
    status: 'In Relationship',
    progress: 43,
    day: 0,
    month: 0,
    year: 0,
  },
];

export default function DataGridPage() {
  var def: GridDefinition<DataType> = {
    pagination: true,
    columns: [
      { key: 'name', columns: [{ key: 'first_name' }, { key: 'last_name' }] },
      { key: 'age' },
      { key: 'email' },
      { key: 'country' },
      { key: 'favorite_color' },
      { key: 'gender' },
      { key: 'job_title' },
      { key: 'ssn' },
      { key: 'birthdate' },
      { key: 'phone_number' },
      { key: 'street_address' },
      { key: 'city' },
      { key: 'username' },
      { key: 'credit_card_number' },
      { key: 'salary' },
      { key: 'company_name' },
      { key: 'language' },
      { key: 'currency_code' },
    ],
  };

  // var def2: GridDef<Person> = {
  //   columns: [
  //     {
  //       key: 'employee',
  //       columns: [{ key: 'firstName' }, { key: 'lastName' }],
  //     },
  //     { key: 'visits' },
  //     { key: 'status' },

  //     { key: 'progress' },
  //   ],
  //   pagination: true,
  // };

  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        DataGrid
      </Box>

      <DataGrid data={Data} def={def} />
      {/* <DataGrid data={data} def={def2} mt={10} /> */}
    </Box>
  );

  return (
    <Box p={10} overflow="hidden" width={200} height={60}>
      {/* <Box height="fit" overflow="scroll"> */}
      <Grid
        gridTemplateColumns={10}
        columnGap={10}
        rowGap={4}
        style={{ gridTemplateColumns: 'repeat(4 , 1fr)' }}
        overflow="scroll"
        height="fit"
      >
        <Box display="contents">
          <Box position="sticky" left={0} colSpan={2}>
            TOP Header
          </Box>
          <Box position="sticky" left={0} gridRow={3}>
            Header 1
          </Box>
          <Box position="sticky" top={0} gridRow={1}>
            Header 2
          </Box>
          <Box position="sticky" top={0}>
            Header 3
          </Box>
          <Box position="sticky" top={0}>
            Header 4
          </Box>
          <Box position="sticky" top={0}>
            Header 5
          </Box>
          <Box position="sticky" top={0}>
            Header 6
          </Box>
          <Box position="sticky" top={0}>
            Header 7
          </Box>
          <Box position="sticky" top={0}>
            Header 8
          </Box>
        </Box>
        <Box display="contents">
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
        </Box>
        <Box display="contents">
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
        </Box>
      </Grid>
      {/* </Box> */}
    </Box>
  );
}
