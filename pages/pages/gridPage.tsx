import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Grid from '../../src/components/grid';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';

export default function GridPage() {
  return (
    <Box>
      <PageHeader icon={LayoutGrid} title="Grid" description="A shortcut component for display: grid with powerful layout features." />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import Grid from '@cronocode/react-box/components/grid';" />

          <Code
            label="Grid Layout"
            language="jsx"
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
              <Box bgColor="violet-400" borderRadius={1} p={6} px={4} gridColumn={2}>
                colspan 2
              </Box>
              <Box bgColor="violet-400" borderRadius={1} p={6} px={4} gridColumn="full-row">
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
              <Box bgColor="violet-400" borderRadius={1} p={6} px={4} gridColumn={3} gridColumnStart={1}>
                colstart 2 / colspan 2
              </Box>
              <Box bgColor="violet-400" borderRadius={1} p={6} px={4} gridColumnStart={2} gridColumnEnd={4} hover={{ gridColumnEnd: 5 }}>
                colstart 3 / colend 5 <br /> colend hover 6
              </Box>
            </Grid>
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}
