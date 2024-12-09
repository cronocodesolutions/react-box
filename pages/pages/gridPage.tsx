import Box from '../../src/box';
import Grid from '../../src/components/grid';
import Code from '../components/code';

export default function GridPage() {
  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Grid
      </Box>

      <Box tag="h4" fontSize={18} fontWeight={400} mb={10}>
        This is shortcut for{' '}
        <Box inline textDecoration="underline">
          display: grid;
        </Box>
      </Box>

      <Code label="Import" code="import Grid from '@cronocode/react-box/components/grid';" />

      <Code
        mt={10}
        label="Grid"
        code={`<Grid
  borderRadius={1}
  gap={4}
  p={4}
  bgImage="bg-stripes"
  gridTemplateColumns={4}
  style={{ backgroundSize: '7.07px 7.07px' }}
  color="white"
>
  <Box bgColor="violet-400" borderRadius={1} p={6} px={4}>
    Cell
  </Box>
  <Box bgColor="violet-400" borderRadius={1} p={6} px={4} colSpan={2}>
    colspan 2
  </Box>
  <Box bgColor="violet-400" borderRadius={1} p={6} px={4} colSpan="full-row">
    colspan full row
  </Box>
  <Box bgColor="violet-400" borderRadius={1} p={6} px={4}>
    Cell
  </Box>
  <Box bgColor="violet-400" borderRadius={1} p={6} px={4}>
    Cell
  </Box>
  <Box bgColor="violet-400" borderRadius={1} p={6} px={4} gridColumnStart={2}>
    colstart 2
  </Box>
  <Box bgColor="violet-400" borderRadius={1} p={6} px={4} colSpan={3} gridColumnStart={1}>
    colstart 2 / colspan 2
  </Box>
  <Box bgColor="violet-400" borderRadius={1} p={6} px={4} gridColumnStart={2} gridColumnEnd={4} hover={{ gridColumnEnd: 5 }}>
    colstart 3 / colend 5 <br /> colend hover 6
  </Box>
</Grid>`}
      >
        <Grid
          borderRadius={1}
          gap={4}
          p={4}
          bgImage="bg-stripes"
          gridTemplateColumns={4}
          style={{ backgroundSize: '7.07px 7.07px' }}
          color="white"
        >
          <Box bgColor="violet-400" borderRadius={1} p={6} px={4}>
            Cell
          </Box>
          <Box bgColor="violet-400" borderRadius={1} p={6} px={4} colSpan={2}>
            colspan 2
          </Box>
          <Box bgColor="violet-400" borderRadius={1} p={6} px={4} colSpan="full-row">
            colspan full row
          </Box>
          <Box bgColor="violet-400" borderRadius={1} p={6} px={4}>
            Cell
          </Box>
          <Box bgColor="violet-400" borderRadius={1} p={6} px={4}>
            Cell
          </Box>
          <Box bgColor="violet-400" borderRadius={1} p={6} px={4} gridColumnStart={2}>
            colstart 2
          </Box>
          <Box bgColor="violet-400" borderRadius={1} p={6} px={4} colSpan={3} gridColumnStart={1}>
            colstart 2 / colspan 2
          </Box>
          <Box bgColor="violet-400" borderRadius={1} p={6} px={4} gridColumnStart={2} gridColumnEnd={4} hover={{ gridColumnEnd: 5 }}>
            colstart 3 / colend 5 <br /> colend hover 6
          </Box>
        </Grid>
      </Code>
    </Box>
  );
}
