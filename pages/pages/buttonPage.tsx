import Box from '../../src/box';
import Button from '../../src/components/button/button';

export default function ButtonPage() {
  return (
    <Box>
      <Box py={3}>
        <Button disabled onClick={() => alert('Click')}>
          Click me!
        </Button>
      </Box>
      <Box py={3}>
        <Button onClick={() => alert('Click')}>Click me 2!</Button>
      </Box>
    </Box>
  );
}
