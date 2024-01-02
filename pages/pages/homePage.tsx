import Box from '../../src/box';
import Button from '../../src/components/button/button';
import Flex from '../../src/components/flex/flex';
import hljs from 'highlight.js';

export default function HomePage() {
  const npmInstall = hljs.highlight('> npm install @cronocode/react-box', { language: 'shell' }).value;
  const importDeps = hljs.highlight('@cronocode/react-box/style.css', { language: 'javascript' }).value;
  const highlightedCode = hljs.highlight(
    `import Box from '@cronocode/react-box';
  
function Component () {
  return <Box>Hello world</Box>;
}
`,
    { language: 'js' },
  ).value;

  return (
    <Flex ai="center" width="fit" mt={20} d="column">
      {/* <Box> */}
      <Box fontSize={60} color="violet">
        Productivity tool
      </Box>
      <Box fontSize={24}>to rapidly build modern web app based on React library.</Box>
      {/* </Box> */}
      <Box mt={20} fontSize={30}>
        Steps to start
      </Box>

      <Box mt={12}>
        <Flex ai="center" gap={3}>
          <Box component="number">1</Box>
          <Box>Install npm library</Box>
        </Flex>
        <Box tag="pre">
          <Box component="code" tag="code" mt={1} props={{ dangerouslySetInnerHTML: { __html: npmInstall } }} />
        </Box>
        <Flex ai="center" gap={3} mt={5}>
          <Box component="number">2</Box>
          <Box>
            Import CSS file in main{' '}
            <Box inline fontWeight={700}>
              .tsx
            </Box>{' '}
            or
            <Box inline fontWeight={700}>
              .css
            </Box>
          </Box>
        </Flex>
        <Box tag="pre">
          <Box component="code" tag="code" mt={1} props={{ dangerouslySetInnerHTML: { __html: importDeps } }} />
        </Box>
        <Flex ai="center" gap={3} mt={5}>
          <Box component="number">3</Box>
          <Box>Use Box</Box>
        </Flex>
        <Box tag="pre">
          <Box component="code" tag="code" mt={1} props={{ dangerouslySetInnerHTML: { __html: highlightedCode } }} />
        </Box>
      </Box>
    </Flex>
  );
}
