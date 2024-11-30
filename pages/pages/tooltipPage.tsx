import { useState } from 'react';
import Box from '../../src/box';
import Tooltip from '../../src/components/tooltip';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';

export default function TooltipPage() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Tooltip
      </Box>
      <Box mt={10} maxWidth={200} height={40} b={1} borderRadius={1} overflow="auto" bgColor="violet-100" position="relative">
        <Flex jc="space-between">
          <Box position="sticky" top={4} textAlign="right" m={4}>
            (position absolute)
          </Box>
          <Box position="sticky" top={4} textAlign="right" m={4}>
            overflow hidden box
          </Box>
        </Flex>
        <Flex ml={4} jc="center">
          <Button onClick={() => setOpen1(!open1)} position="relative" jc="center">
            Click me!
            {open1 && (
              <Box
                textAlign="left"
                height={50}
                borderRadius={2}
                p={3}
                left={0}
                top={12}
                color="violet-950"
                bgColor="violet-200"
                b={1}
                position="absolute"
              >
                position absolute box
              </Box>
            )}
          </Button>
        </Flex>
      </Box>

      <Box mt={10} maxWidth={200} height={40} b={1} borderRadius={1} overflow="auto" bgColor="violet-100" position="relative">
        <Flex jc="space-between">
          <Box position="sticky" top={4} textAlign="right" m={4}>
            (tooltip)
          </Box>
          <Box position="sticky" top={4} textAlign="right" m={4}>
            overflow hidden box
          </Box>
        </Flex>
        <Flex ml={4} jc="center">
          <Box>
            <Button onClick={() => setOpen2(!open2)} display="block">
              Click me!
            </Button>
            {open2 && (
              <Tooltip height={50} borderRadius={2} p={3} top={1} bgColor="violet-200" b={1}>
                tooltip box
              </Tooltip>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
