import Box from '../../src/box';
import Grid from '../../src/components/grid';

export default function GridPage() {
  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Grid
      </Box>
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
    </Box>
  );
}
