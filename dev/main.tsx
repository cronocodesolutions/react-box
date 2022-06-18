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
      display="flex"
      b={3}
      bStyle="dotted"
      bColor="brown"
    >
      test
    </Box>
  </React.StrictMode>,
);
