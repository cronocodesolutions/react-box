import React from 'react';
import ReactDOM from 'react-dom/client';
import './theme.css';
import Box from './../src/box';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Box>This is react box</Box>
  </React.StrictMode>,
);
