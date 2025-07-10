import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import Code from '../components/code';
import DarkSvg from '../svgs/darkSvg';
import LightSvg from '../svgs/lightSvg';

export default function ThemeSetupPage() {
  return (
    <Box>
      <Box tag="h1" mb={3} fontSize={24}>
        Theme Setup
      </Box>

      <Box tag="h4" fontSize={18} fontWeight={400} mb={10}>
        In order to customize your app design you can define your styles as a theme.
      </Box>

      <Code
        label="Define your own styles"
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
}

`}
        mt={10}
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
        label="Change theme from the child component"
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
}
`}
        mt={10}
      >
        <Box.Theme theme="light">
          <Sample />
        </Box.Theme>
      </Code>
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
}
