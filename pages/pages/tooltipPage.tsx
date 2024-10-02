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
      <Button onClick={() => setOpenDD(!openDD)} display="block" mt={2} p={0}>
        <Box p={3}>Click me ↓↑</Box>
        {openDD && (
          <Tooltip borderRadius={2} p={3} bgColor="violetLight" b={1} borderColor="violet" top={1}>
            <Box>Item 1</Box>
            <Box>Item 2</Box>
            <Box>Item 3</Box>
            <Box>Item 4</Box>
            <Box>Item 5</Box>
            <Box>Item 6</Box>
            <Box>Item 7</Box>
            <Box>Item 8</Box>
          </Tooltip>
        )}
      </Button>

      <Box mt={10} width={200} height={72} b={1} borderRadius={1} overflow="auto" bgColor="violetLighter" position="relative">
        <Box position="sticky" top={4} textAlign="right" m={4}>
          overflow hidden box
        </Box>
        <Flex ml={4} jc="center">
          <Button onClick={() => setOpen1(!open1)} position="relative" width={60} jc="center">
            Click me! (position absolute)
            {open1 && (
              <Box
                textAlign="left"
                height={80}
                width={76}
                borderRadius={2}
                p={3}
                left={0}
                top={12}
                color="violetDark"
                bgColor="violetLight"
                b={1}
                borderColor="violet"
                position="absolute"
              >
                position absolute box
              </Box>
            )}
          </Button>
        </Flex>
      </Box>

      <Box mt={10} width={200} height={72} b={1} borderRadius={1} overflow="auto" bgColor="violetLighter" position="relative">
        <Box position="sticky" top={4} textAlign="right" m={4}>
          overflow hidden box
        </Box>
        <Flex ml={4} jc="center">
          <Box>
            <Button onClick={() => setOpen2(!open2)} display="block" width={60}>
              Click me! (tooltip)
            </Button>
            {open2 && (
              <Tooltip height={80} width={76} borderRadius={2} p={3} top={1} bgColor="violetLight" b={1} borderColor="violet">
                tooltip box
              </Tooltip>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
