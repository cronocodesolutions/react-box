import { useEffect, useLayoutEffect, useRef } from 'react';
import Box from '../../src/box';
import Button from '../../src/components/button';
import Code from '../components/code';
import Flex from '../../src/components/flex';
import { themeStyles } from '../theme';

export default function ThemeSetupPage() {
  const initialRenderRef = useRef(true);

  if (initialRenderRef.current) {
    initialRenderRef.current = false;
    Box.themeSetup({
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
    });
  }

  useEffect(() => () => Box.themeSetup(themeStyles), []);

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
        
Box.themeSetup({
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
});`}
        mt={10}
      ></Code>

      <Code
        label="Usage"
        code={`import Button from '@cronocode/react-box/components/button';
        
function Component() {
  return (
    <Flex gap={3}>
      <Button>Default</Button>
      <Button theme="primary">Primary</Button>
      <Button theme="secondary">Secondary</Button>
    </Flex>
  );
}
`}
        mt={10}
      >
        <Flex gap={3}>
          <Button>Default</Button>
          <Button theme="primary">Primary</Button>
          <Button theme="secondary">Secondary</Button>
        </Flex>
      </Code>
    </Box>
  );
}
