import { useState } from 'react';
import Box from '../../src/box';
import Tooltip from '../../src/components/tooltip';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';

export default function TooltipPage() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [openDD, setOpenDD] = useState(false);

  return (
    <Box p={10}>
      <Box>This is Tooltip page</Box>

      <Box bgColor="violetLighter" inline>
        <Button onClick={() => setOpenDD(!openDD)}>Click me ↓↑</Button>
        {openDD && (
          <Tooltip>
            <Box b={1} bgColor="violet">
              <Box>Item 1</Box>
              <Box>Item 2</Box>
              <Box>Item 3</Box>
              <Box>Item 4</Box>
              <Box>Item 5</Box>
              <Box>Item 6</Box>
              <Box>Item 7</Box>
              <Box>Item 8</Box>
            </Box>
          </Tooltip>
        )}
      </Box>

      <Box mt={10} style={{ width: 800, height: 300 }} b={1} overflow="auto" bgColor="violet" position="relative">
        <Box>overflow hidden box</Box>
        <Flex>
          <Box m={4} position="relative">
            <Button onClick={() => setOpen1(!open1)}>Click me! (position absolute)</Button>
            {open1 && (
              <Box style={{ width: 300, height: 500 }} b={1} left={0} top={11} bgColor="violetLight" position="absolute">
                position absolute box
              </Box>
            )}
          </Box>
          <Box m={4}>
            <Button onClick={() => setOpen2(!open2)}>Click me! (tooltip)</Button>
            {open2 && (
              <Tooltip style={{ width: 300, height: 500 }} b={1} bgColor="violetLight" position="absolute">
                tooltip box
              </Tooltip>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
