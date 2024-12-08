import Box from '../../src/box';
import Button from '../../src/components/button';
import Code from '../components/code';
import Flex from '../../src/components/flex';
import LightSvg from '../svgs/lightSvg';
import DarkSvg from '../svgs/darkSvg';

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
        
Box.themeSetup({
  demoTheme: {
    button: {
      styles: {
        bgColor: 'blue-500',
        b: 0,
        hover: {
          bgColor: 'blue-400',
        },
      },
      themes: {
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
  },
});

function App() {
  return (
    <Box.Theme theme="demoTheme">
      <Flex gap={3}>
        <Button>Default</Button>
        <Button theme="primary">Primary</Button>
        <Button theme="secondary">Secondary</Button>
      </Flex>
    </Box.Theme>
  );
}
`}
        mt={10}
      >
        <Box.Theme theme="demoTheme">
          <Flex gap={3}>
            <Button>Default</Button>
            <Button theme="primary">Primary</Button>
            <Button theme="secondary">Secondary</Button>
          </Flex>
        </Box.Theme>
      </Code>

      <Code
        label="Change theme from the child component"
        code={`import Box from '@cronocode/react-box';
        
Box.themeSetup({
  light: {
    components: {
      bg: {
        styles: {
          color: 'indigo-950',
          bgColor: 'white',
        },
      },
      icon: {
        styles: {
          fill: 'indigo-950',
        },
      },
    },
  },
  dark: {
    components: {
      bg: {
        styles: {
          color: 'white',
          bgColor: 'indigo-950',
        },
      },
      icon: {
        styles: {
          fill: 'white',
        },
      },
    },
  },
});

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
    <Box component="bg" p={3} borderRadius={2} b={1}>
      <Flex gap={3}>
        <Button bgColor="transparent" onClick={() => setTheme('light')}>
          <LightSvg component="icon" />
        </Button>
        <Button bgColor="transparent" onClick={() => setTheme('dark')}>
          <DarkSvg component="icon" />
        </Button>
      </Flex>
      <Box p={3} textTransform="capitalize">
        {theme}
      </Box>
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
    <Box component="bg" p={3} borderRadius={2} b={1}>
      <Flex gap={3} ai="center">
        <Button bgColor="transparent" onClick={() => setTheme('light')}>
          <LightSvg component="icon" />
        </Button>
        <Button bgColor="transparent" onClick={() => setTheme('dark')}>
          <DarkSvg component="icon" />
        </Button>
        <Box textTransform="capitalize" p={3}>
          This is {theme} theme
        </Box>
      </Flex>
    </Box>
  );
}
