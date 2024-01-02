import Box from '../../src/box';
import Button from '../../src/components/button/button';
import Flex from '../../src/components/flex/flex';

export default function HomePage() {
  return (
    <Flex ai="center" width="fit" mt={20} d="column">
      {/* <Box> */}
      <Box fontSize={60} color="violet">
        Productivity tool
      </Box>
      <Box fontSize={24}>to rapidly build modern web app based on React library.</Box>
      {/* </Box> */}
      <Box mt={20}>
        <Button>Get started</Button>
      </Box>

      <Box mt={20}>
        <Flex ai="center" gap={3}>
          <Box component="number">1</Box>
          <Box>Install npm library</Box>
        </Flex>
        <Box component="code" mt={1}>
          npm install @cronocode/react-box
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
        <Box component="code" mt={1}>
          @cronocode/react-box/style.css
        </Box>
        <Flex ai="center" gap={3} mt={5}>
          <Box component="number">3</Box>
          <Box>Use Box</Box>
        </Flex>
        <Box component="code" mt={1}>
          <Box>{`function YourComponent() {`}</Box>
          <Box ml={4}>{`return <Box>This is box component</Box>;`}</Box>
          <Box>{`}`}</Box>
        </Box>
      </Box>
    </Flex>
  );
}
