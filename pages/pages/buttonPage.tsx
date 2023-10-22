import Box from '../../src/box';
import Button from '../../src/components/button/button';

export default function ButtonPage() {
  return (
    <Box>
      <Box py={3}>
        <Button component="button" type="button">
          Click me!
        </Button>
      </Box>
    </Box>
  );
}
