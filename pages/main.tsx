import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app';
import './theme.css';
import { BrowserRouter } from 'react-router-dom';
import Theme from '../src/theme';

Theme.setup({
  textbox: {
    styles: {
      b: 1,
      borderRadius: 2,
      px: 3,
      py: 3,
      outlineF: 1,
      borderColor: 'darkblue',
      color: 'darkblue',
      outlineColor: 'darkblue',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
