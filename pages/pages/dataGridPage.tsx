import Box from '../../src/box';
import DataGrid from '../../src/components/dataGrid/dataGrid';

interface Person {
  firstName: string;
  lastName: string;
  age: number;
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
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
];

export default function DataGridPage() {
  return (
    <Box>
      <Box fontSize={24}>Component status:</Box>
      <Box fontSize={18}>Work in progress</Box>
      <Box p={2} mt={4}>
        <DataGrid />
      </Box>
      <Box p={2}>
        <DataGrid data={data} />
      </Box>
    </Box>
  );
}
