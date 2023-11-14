import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app';
import './theme.css';
import { BrowserRouter } from 'react-router-dom';
import Theme from '../src/theme';

const root = ReactDOM.createRoot(document.getElementById('root')!);

Theme.setup({
  button: {
    styles: {
      padding: 1,
    },
  },
});

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
