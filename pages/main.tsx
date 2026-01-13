import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Box from '../src/box';
import App from './app/app';
import './extends';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Box.Theme theme="dark">
        <App />
      </Box.Theme>
    </BrowserRouter>
  </React.StrictMode>,
);
