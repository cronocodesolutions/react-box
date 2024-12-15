import Box from '../../src/box';
import DataGrid from '../../src/components/dataGrid';
import { GridDef } from '../../src/components/dataGrid/dataGridContract';
import Grid from '../../src/components/grid';

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
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
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
  {
    firstName: 'super',
    lastName: 'user',
    age: 38,
    visits: 76,
    status: 'In Relationship',
    progress: 59,
  },
  {
    firstName: 'Jackie',
    lastName: 'Chan',
    age: 62,
    visits: 3002,
    status: 'In Relationship',
    progress: 43,
  },
];

export default function DataGridPage() {
  var def: GridDef<Person> = {
    columns: [{ key: 'firstName' }, { key: 'lastName' }, { key: 'age' }, { key: 'visits' }, { key: 'status' }, { key: 'progress' }],
  };

  var def2: GridDef<Person> = {
    columns: [{ key: 'firstName' }, { key: 'lastName' }, { key: 'age' }, { key: 'visits' }, { key: 'status' }, { key: 'progress' }],
    pagination: true,
  };

  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        DataGrid
      </Box>
      <DataGrid data={data} def={def} />

      <DataGrid data={data} def={def2} mt={10} />
    </Box>
  );

  return (
    <Box p={10} overflow="hidden" width={200} height={60}>
      {/* <Box height="fit" overflow="scroll"> */}
      <Grid
        gridTemplateColumns={10}
        columnGap={10}
        rowGap={4}
        style={{ gridTemplateColumns: 'repeat(10 , 1fr)' }}
        overflow="scroll"
        height="fit"
      >
        <Box display="contents">
          <Box position="sticky" left={0} zIndex={1} top={0}>
            Header
          </Box>
          <Box position="sticky" top={0}>
            Header
          </Box>
          <Box position="sticky" top={0}>
            Header
          </Box>
          <Box position="sticky" top={0}>
            Header
          </Box>
          <Box position="sticky" top={0}>
            Header
          </Box>
          <Box position="sticky" top={0}>
            Header
          </Box>
          <Box position="sticky" top={0}>
            Header
          </Box>
          <Box position="sticky" top={0}>
            Header
          </Box>
          <Box position="sticky" top={0}>
            Header
          </Box>
          <Box position="sticky" right={0} top={0}>
            Header
          </Box>
        </Box>
        <Box display="contents" className="parent">
          <Box position="sticky" left={0} zIndex={1} hoverParent={{ parent: { bgColor: 'gray-300' } }}>
            this is cell with data
          </Box>
          <Box hoverParent={{ parent: { bgColor: 'gray-300' } }}>this is cell with data</Box>
          <Box hoverParent={{ parent: { bgColor: 'gray-300' } }}>this is cell with data</Box>
          <Box hoverParent={{ parent: { bgColor: 'gray-300' } }}>this is cell with data</Box>
          <Box hoverParent={{ parent: { bgColor: 'gray-300' } }}>this is cell with data</Box>
          <Box hoverParent={{ parent: { bgColor: 'gray-300' } }}>this is cell with data</Box>
          <Box hoverParent={{ parent: { bgColor: 'gray-300' } }}>this is cell with data</Box>
          <Box hoverParent={{ parent: { bgColor: 'gray-300' } }}>this is cell with data</Box>
          <Box hoverParent={{ parent: { bgColor: 'gray-300' } }}>this is cell with data</Box>
          <Box position="sticky" right={0} hoverParent={{ parent: { bgColor: 'gray-300' } }}>
            this is cell with data
          </Box>
        </Box>
        <Box display="contents">
          <Box position="sticky" left={0} zIndex={1}>
            this is cell with data
          </Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box position="sticky" right={0}>
            this is cell with data
          </Box>
        </Box>
        <Box display="contents">
          <Box position="sticky" left={0} zIndex={1}>
            this is cell with data
          </Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box position="sticky" right={0}>
            this is cell with data
          </Box>
        </Box>
        <Box display="contents">
          <Box position="sticky" left={0} zIndex={1}>
            this is cell with data
          </Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box>this is cell with data</Box>
          <Box position="sticky" right={0}>
            this is cell with data
          </Box>
        </Box>
      </Grid>
      {/* </Box> */}
    </Box>
  );
}
