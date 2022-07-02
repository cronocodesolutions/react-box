import React from 'react';
import ReactDOM from 'react-dom/client';
import Box from './../src/box';
import Button from './../src/components/button/button';
import Flex from './../src/components/flex/flex';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Box
      bRadiusTop={3}
      mx={7}
      ml={5}
      m={3}
      pt={4}
      px={9}
      display="block"
      b={3}
      bStyle="dotted"
      bColor="brown"
      cursor="not-allowed"
      fontWeight={900}
      flex1
      color="green"
    >
      <Flex my={4} marginTop={8} ml={2}>
        test flex
      </Flex>
      <Button p={2} bgColor="blueDark" color="black">
        Button
      </Button>
      <Flex>
        <Box flex1>test1</Box>
        <Box>test2</Box>
      </Flex>
    </Box>
  </React.StrictMode>,
);
