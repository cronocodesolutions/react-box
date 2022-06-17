import React from 'react';
import ReactDOM from 'react-dom/client';
import Box from './../src/box';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Box mx={7} ml={2} m={3} pt={4} px={9}>
      test
    </Box>
  </React.StrictMode>,
);
