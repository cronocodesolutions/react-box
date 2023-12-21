import { useState } from 'react';
import Box from '../../src/box';
import Tooltip from '../../src/components/tooltip/tooltip';
import Button from '../../src/components/button/button';
import Flex from '../../src/components/flex/flex';

export default function TooltipPage() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [openDD, setOpenDD] = useState(false);

  return (
    <Box>
      <Box>This is Tooltip page</Box>

      <Box position="relative" inline>
        <Button onClick={() => setOpenDD(!openDD)}>Click me ↓↑</Button>
        {openDD && (
          <Tooltip width="fit" top={8}>
            <Box b={1} bgColor="violet">
              <Box>Item 1</Box>
              <Box>Item 2</Box>
            </Box>
          </Tooltip>
        )}
      </Box>

      <Box mt={40} style={{ width: 800, height: 300 }} b={1} overflow="auto" bgColor="violet" position="relative">
        <Box>overflow hidden box</Box>
        <Flex>
          <Button m={4} position="relative" onClick={() => setOpen1(!open1)}>
            Click me!
            {open1 && (
              <Box style={{ width: 300, height: 900 }} b={1} left={0} top={11} bgColor="violetLight" position="absolute">
                position absolute box
              </Box>
            )}
          </Button>
          <Button m={4} ml={60} position="relative" onClick={() => setOpen2(!open2)}>
            Click me!
            {open2 && (
              <Tooltip top={11}>
                <Box overflow="hidden" b={1} borderRadius={2}>
                  <Box style={{ height: 400 }} overflow="auto">
                    <Box style={{ width: 300, height: 900 }} bgColor="violetLight">
                      position absolute box
                    </Box>
                  </Box>
                </Box>
              </Tooltip>
            )}
          </Button>
        </Flex>
      </Box>

      <Box mt={40} style={{ width: 800, height: 300 }} b={1} overflow="auto" bgColor="violet" position="relative">
        <Box>overflow hidden box</Box>
        <Flex>
          <Button m={4} position="relative" onClick={() => setOpen3(!open3)}>
            Click me!
            {open3 && (
              <Box style={{ width: 300, height: 900 }} b={1} left={0} top={11} bgColor="violetLight" position="absolute">
                position absolute box
              </Box>
            )}
          </Button>
          <Button m={4} ml={60} position="relative" onClick={() => setOpen4(!open4)}>
            Click me!
            {open4 && (
              <Tooltip top={11}>
                <Box overflow="hidden" b={1} borderRadius={2}>
                  <Box style={{ height: 400 }} overflow="auto">
                    <Box style={{ width: 300, height: 900 }} bgColor="violetLight">
                      position absolute box
                    </Box>
                  </Box>
                </Box>
              </Tooltip>
            )}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
