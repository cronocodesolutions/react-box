import React from 'react';
import ReactDOM from 'react-dom/client';
import Box from './../src/box';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Box
      bRadiusTop={3}
      bgColor="navy"
      bgColorHover="green"
      color="white"
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
      opacity={30}
      fontWeight={900}
      textAlign="right"
    >
      test
    </Box>
  </React.StrictMode>,
);
