import { motion } from 'framer-motion';
import { Box as BoxIcon } from 'lucide-react';
import { useState } from 'react';
import Box from '../../src/box';
import Flex from '../../src/components/flex';
import Textbox from '../../src/components/textbox';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';

export default function BoxPage() {
  const [props, setProps] = useState({
    b: 1,
    borderRadius: 2,
    m: 0,
    p: 4,
  });

  const stringProps = Object.entries(props)
    .map(([key, value]) => `${key}={${value}}`)
    .join(' ');

  return (
    <Box>
      <PageHeader
        icon={BoxIcon}
        title="Box"
        description="The foundational component with CSS-as-props. Build anything with type-safe styling."
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code label="Import" language="jsx" code="import Box from '@cronocode/react-box';" />

          <Box>
            <Box fontSize={14} fontWeight={600} theme={{ dark: { color: 'slate-300' }, light: { color: 'slate-700' } }} mb={4}>
              Interactive Playground
            </Box>
            <Flex gap={6} d="column" lg={{ d: 'row' }}>
              <Flex
                width="fit"
                lg={{ width: 60 }}
                p={5}
                d="column"
                gap={4}
                theme={{
                  dark: { bgColor: 'slate-800', borderColor: 'slate-700' },
                  light: { bgColor: 'white', borderColor: 'slate-200' },
                }}
                b={1}
                borderRadius={2}
              >
                <Box fontSize={13} fontWeight={500} theme={{ dark: { color: 'slate-400' }, light: { color: 'slate-500' } }} mb={2}>
                  Adjust Props
                </Box>
                <Flex d="column" gap={3}>
                  <Flex ai="center" jc="space-between">
                    <Box fontSize={13} theme={{ dark: { color: 'slate-300' }, light: { color: 'slate-600' } }}>
                      Border
                    </Box>
                    <Textbox
                      width={20}
                      defaultValue={props.b}
                      type="number"
                      theme={{ dark: { bgColor: 'slate-700', color: 'white' } }}
                      onChange={(e) => setProps((prev) => ({ ...prev, b: +e.target.value }))}
                    />
                  </Flex>
                  <Flex ai="center" jc="space-between">
                    <Box fontSize={13} theme={{ dark: { color: 'slate-300' }, light: { color: 'slate-600' } }}>
                      Border Radius
                    </Box>
                    <Textbox
                      width={20}
                      defaultValue={props.borderRadius}
                      type="number"
                      theme={{ dark: { bgColor: 'slate-700', color: 'white' } }}
                      onChange={(e) => setProps((prev) => ({ ...prev, borderRadius: +e.target.value }))}
                    />
                  </Flex>
                  <Flex ai="center" jc="space-between">
                    <Box fontSize={13} theme={{ dark: { color: 'slate-300' }, light: { color: 'slate-600' } }}>
                      Margin
                    </Box>
                    <Textbox
                      width={20}
                      defaultValue={props.m}
                      type="number"
                      theme={{ dark: { bgColor: 'slate-700', color: 'white' } }}
                      onChange={(e) => setProps((prev) => ({ ...prev, m: +e.target.value }))}
                    />
                  </Flex>
                  <Flex ai="center" jc="space-between">
                    <Box fontSize={13} theme={{ dark: { color: 'slate-300' }, light: { color: 'slate-600' } }}>
                      Padding
                    </Box>
                    <Textbox
                      width={20}
                      defaultValue={props.p}
                      type="number"
                      theme={{ dark: { bgColor: 'slate-700', color: 'white' } }}
                      onChange={(e) => setProps((prev) => ({ ...prev, p: +e.target.value }))}
                    />
                  </Flex>
                </Flex>
              </Flex>

              <Flex flex1 d="column" gap={4}>
                <Code language="jsx" label="Generated Code">
                  {`import Box from '@cronocode/react-box';

function Component() {
  return <Box ${stringProps}>Hello world</Box>;
}`}
                </Code>

                <Flex
                  flex1
                  ai="center"
                  jc="center"
                  p={8}
                  minHeight={40}
                  theme={{
                    dark: { bgColor: 'slate-800', borderColor: 'slate-700' },
                    light: { bgColor: 'slate-50', borderColor: 'slate-200' },
                  }}
                  b={1}
                  borderRadius={2}
                >
                  <Box
                    {...props}
                    theme={{ dark: { borderColor: 'slate-500', color: 'white' }, light: { borderColor: 'slate-300', color: 'slate-900' } }}
                  >
                    Hello world
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </motion.div>
    </Box>
  );
}
