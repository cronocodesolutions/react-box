import Box from '../../src/box';
import Grid from '../../src/components/grid';

export default function GridPage() {
  return (
    <Box p={10}>
      <Grid
        borderRadius={1}
        gap={4}
        p={4}
        background="stripes"
        gridTemplateColumns={5}
        style={{ backgroundSize: '7.07px 7.07px' }}
        color="white"
      >
        <Box b={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6}>
          Cell
        </Box>
        <Box b={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6} colSpan={2}>
          colspan 2
        </Box>
        <Box b={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6} colSpan="full-row">
          colspan full row
        </Box>
        <Box b={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6}>
          Cell
        </Box>
        <Box b={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6}>
          Cell
        </Box>
        <Box b={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6} gridColumnStart={2}>
          colstart 2
        </Box>
        <Box b={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6} colSpan={2} gridColumnStart={2}>
          colstart 2 / colspan 2
        </Box>
        <Box
          b={1}
          borderColor="violet"
          bgColor="violet"
          borderRadius={1}
          p={6}
          gridColumnStart={3}
          gridColumnEnd={5}
          hover={{ gridColumnEnd: 6 }}
        >
          colstart 3 / colend 5 / colend hover 6
        </Box>
      </Grid>
    </Box>
  );
}
