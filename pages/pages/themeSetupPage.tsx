import { motion } from 'framer-motion';
import { Moon, Paintbrush, Sun } from 'lucide-react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Flex from '../../src/components/flex';
import { Link } from '../../src/components/semantics';
import Code from '../components/code';
import PageHeader from '../components/pageHeader';
import usePageContext from '../hooks/usePageContext';

export default function ThemeSetupPage() {
  usePageContext(<RightSidebar />);

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
            id="define-styles"
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
            id="theme-switching"
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

const sidebarLinks = [
  { id: 'define-styles', label: 'Define Your Own Styles' },
  { id: 'theme-switching', label: 'Theme Switching' },
] as const;

function RightSidebar() {
  return (
    <Flex d="column" gap={1} pt={10}>
      {sidebarLinks.map((link) => (
        <Link
          key={link.id}
          props={{ href: `#${link.id}` }}
          fontSize={13}
          py={1}
          px={2}
          borderRadius={1}
          textDecoration="none"
          theme={{
            dark: { color: 'slate-400', hover: { color: 'white', bgColor: 'slate-800' } },
            light: { color: 'slate-600', hover: { color: 'slate-900', bgColor: 'slate-100' } },
          }}
        >
          {link.label}
        </Link>
      ))}
    </Flex>
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
          <Sun size={18} color="#fbbf24" />
        </Button>
        <Button bgColor="transparent" onClick={() => setTheme('inner-dark')}>
          <Moon size={18} color="#6366f1" />
        </Button>
        <Box textTransform="capitalize" p={3}>
          This is {theme} theme
        </Box>
      </Flex>
    </Box>
  );
}
