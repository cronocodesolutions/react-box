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
  button: {
    styles: {
      b: 1,
      borderRadius: 2,
      p: 3,
      bgColor: 'violetLighter',
    },
    disabled: {
      bgColor: 'violetLighter',
      color: 'violet',
    },
  },
  checkbox: {
    styles: {
      b: 1,
      borderColorH: 'violet',
      p: 2,
      borderRadius: 1,
      bgColorH: 'violetLight',
      cursor: 'pointer',
      transition: 'none',
    },
  },
  components: {
    test: {
      styles: {
        alignContent: 'baseline',
      },
    },
    textbox: {
      styles: {
        alignContent: 'baseline',
      },
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
