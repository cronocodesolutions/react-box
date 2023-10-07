import React from 'react';
import ReactDOM from 'react-dom/client';
import Box from './../src/box';
import App from './app/app';
import './theme.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
