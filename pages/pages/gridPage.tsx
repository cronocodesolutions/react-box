import Box from '../../src/box';
import Grid from '../../src/components/grid/grid';

export default function GridPage() {
  return (
    <Box p={10}>
      <Box bgColor="gray1" p={6} borderRadius={1}>
        <Grid borderRadius={1} gap={4} bg="stripes" gridColumns={5} style={{ backgroundSize: '7.07px 7.07px' }}>
          <Box border={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6}>
            Cell
          </Box>
          <Box border={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6} colSpan={2}>
            colspan 2
          </Box>
          <Box border={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6} colSpan="full-row">
            colspan full row
          </Box>
          <Box border={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6}>
            Cell
          </Box>
          <Box border={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6}>
            Cell
          </Box>
          <Box border={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6} colStart={2} paddingH={7}>
            colstart 2
          </Box>
          <Box border={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6} colSpan={2} colStart={2}>
            colstart 2 / colspan 2
          </Box>
          <Box border={1} borderColor="violet" bgColor="violet" borderRadius={1} p={6} colStart={3} colEnd={5} colEndH={6}>
            colstart 3 / colend 5 / colend hover 6
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}
