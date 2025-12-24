import { motion } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';
import { useState } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import Tooltip from '../../src/components/tooltip';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';

export default function TooltipPage() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <Box>
      <PageHeader
        icon={MousePointer2}
        title="Tooltip"
        description="Render a component on top of entire application. Useful when parent has overflow hidden."
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import Tooltip from '@cronocode/react-box/components/tooltip';" />

          <Code
            label="Tooltip Usage"
            language="jsx"
            code={`function Component() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <Flex gap={4} flexWrap="wrap">
      <Box flex1 height={40} b={1} borderRadius={1} overflow="auto" bgColor="violet-100" position="relative" minWidth={80}>
        <Flex jc="space-between">
          <Box position="sticky" top={4} textAlign="right" m={4}>
            (position absolute)
          </Box>
          <Box position="sticky" top={4} textAlign="right" m={4}>
            overflow hidden box
          </Box>
        </Flex>
        <Flex ml={4}>
          <Button onClick={() => setOpen1(!open1)} position="relative" jc="center" width={30}>
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

      <Box flex1 height={40} b={1} borderRadius={1} overflow="auto" bgColor="violet-100" position="relative" minWidth={80}>
        <Flex jc="space-between">
          <Box position="sticky" top={4} textAlign="right" m={4}>
            (tooltip)
          </Box>
          <Box position="sticky" top={4} textAlign="right" m={4}>
            overflow hidden box
          </Box>
        </Flex>
        <Flex ml={4}>
          <Box>
            <Button onClick={() => setOpen2(!open2)} display="block" width={30}>
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
    </Flex>
  );
}`}
          >
            <Flex gap={4} flexWrap="wrap">
              <Box flex1 height={40} b={1} borderRadius={1} overflow="auto" position="relative" minWidth={80}>
                <Flex jc="space-between">
                  <Box position="sticky" top={4} textAlign="right" m={4}>
                    (position absolute)
                  </Box>
                  <Box position="sticky" top={4} textAlign="right" m={4}>
                    overflow hidden box
                  </Box>
                </Flex>
                <Flex ml={4}>
                  <Button onClick={() => setOpen1(!open1)} position="relative" jc="center" width={30}>
                    Click me!
                    {open1 && (
                      <Box
                        textAlign="left"
                        height={50}
                        borderRadius={2}
                        p={3}
                        left={0}
                        top={12}
                        theme={{
                          light: { bgColor: 'slate-300' },
                          dark: { bgColor: 'slate-700' },
                        }}
                        b={1}
                        position="absolute"
                      >
                        position absolute box
                      </Box>
                    )}
                  </Button>
                </Flex>
              </Box>

              <Box flex1 height={40} b={1} borderRadius={1} overflow="auto" position="relative" minWidth={80}>
                <Flex jc="space-between">
                  <Box position="sticky" top={4} textAlign="right" m={4}>
                    (tooltip)
                  </Box>
                  <Box position="sticky" top={4} textAlign="right" m={4}>
                    overflow hidden box
                  </Box>
                </Flex>
                <Flex ml={4}>
                  <Box>
                    <Button onClick={() => setOpen2(!open2)} display="block" width={30}>
                      Click me!
                    </Button>
                    {open2 && (
                      <Tooltip
                        height={50}
                        borderRadius={2}
                        p={3}
                        mt={0.5}
                        b={1}
                        theme={{
                          light: { bgColor: 'slate-300' },
                          dark: { bgColor: 'slate-700' },
                        }}
                      >
                        tooltip box
                      </Tooltip>
                    )}
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}
