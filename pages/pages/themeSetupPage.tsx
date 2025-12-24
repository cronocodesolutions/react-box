import { motion } from 'framer-motion';
import { Paintbrush } from 'lucide-react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import DarkSvg from '../svgs/darkSvg';
import LightSvg from '../svgs/lightSvg';

export default function ThemeSetupPage() {
  return (
    <Box>
      <PageHeader
        icon={Paintbrush}
        title="Theme Setup"
        description="Customize your app design by defining styles as a theme with variants."
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Flex d="column" gap={8}>
          <Code
            label="Define Your Own Styles"
            language="jsx"
            code={`import Box from '@cronocode/react-box';
import Flex from '@cronocode/react-box/components/flex';
import Button from '@cronocode/react-box/components/button';

export const components = Box.components({
  button: {
    styles: {
      bgColor: 'blue-500',
      b: 0,
      hover: {
        bgColor: 'blue-400',
      },
    },
    variants: {
      primary: {
        bgColor: 'sky-400',
        hover: {
          bgColor: 'sky-500',
        },
      },
      secondary: {
        bgColor: 'indigo-400',
        hover: {
          bgColor: 'indigo-500',
        },
      },
    },
  },
});

// Add in .d.ts file ===============================================================================================
import '@cronocode/react-box';
import { ExtractBoxStyles, ExtractComponentsAndVariants } from '@cronocode/react-box/types';
import { components } from './path-to-your-b0x-extends-declaration';

declare module '@cronocode/react-box/types' {
  namespace Augmented {
    interface ComponentsTypes extends ExtractComponentsAndVariants<typeof components> {}
  }
}
// ==================================================================================================================

function App() {
  return (
    <Flex gap={3}>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
    </Flex>
  );
}`}
          >
            <Flex gap={3}>
              <Button>Default</Button>
              <Button component="button.demo" variant="primary">
                Primary
              </Button>
              <Button component="button.demo" variant="secondary">
                Secondary
              </Button>
            </Flex>
          </Code>

          <Code
            label="Theme Switching"
            language="jsx"
            code={`import Box from '@cronocode/react-box';

function App() {
  return (
    <Box.Theme theme="light">
      <Sample />
    </Box.Theme>
  );
}

function Sample() {
  const [theme, setTheme] = Box.useTheme();

  return (
    <Box
      p={3}
      borderRadius={2}
      b={1}
      theme={{
        light: { color: 'indigo-950', bgColor: 'white' },
        dark: { color: 'white', bgColor: 'indigo-950' },
      }}
    >
      <Flex gap={3} ai="center">
        <Button bgColor="transparent" onClick={() => setTheme('light')}>
          <LightSvg theme={{ light: { fill: 'indigo-950' }, dark: { fill: 'white' } }} />
        </Button>
        <Button bgColor="transparent" onClick={() => setTheme('dark')}>
          <DarkSvg theme={{ light: { fill: 'indigo-950' }, dark: { fill: 'white' } }} />
        </Button>
        <Box textTransform="capitalize" p={3}>
          This is {theme} theme
        </Box>
      </Flex>
    </Box>
  );
}`}
          >
            <Box.Theme theme="inner-light">
              <Sample />
            </Box.Theme>
          </Code>
        </Flex>
      </motion.div>
    </Box>
  );
}

function Sample() {
  const [theme, setTheme] = Box.useTheme();

  return (
    <Box
      p={3}
      borderRadius={2}
      b={1}
      theme={{
        'inner-light': { color: 'indigo-950', bgColor: 'white' },
        'inner-dark': { color: 'white', bgColor: 'indigo-950' },
      }}
    >
      <Flex gap={3} ai="center">
        <Button bgColor="transparent" onClick={() => setTheme('inner-light')}>
          <LightSvg theme={{ light: { fill: 'indigo-950' }, dark: { fill: 'white' } }} />
        </Button>
        <Button bgColor="transparent" onClick={() => setTheme('inner-dark')}>
          <DarkSvg theme={{ light: { fill: 'indigo-950' }, dark: { fill: 'white' } }} />
        </Button>
        <Box textTransform="capitalize" p={3}>
          This is {theme} theme
        </Box>
      </Flex>
    </Box>
  );
}
