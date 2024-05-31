import Box from '../../src/box';
import DataGrid from '../../src/components/dataGrid';

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
    <Box p={10}>
      <Box fontSize={24} inline>
        Component status:
      </Box>
      <Box fontSize={18} color="red" inline ml={2}>
        Work In Progress
      </Box>
      <Box p={2} mt={4}>
        <DataGrid />
      </Box>
      <Box p={2}>
        <DataGrid data={data} />
      </Box>
    </Box>
  );
}
