import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app';
import './index.css';
import { HashRouter } from 'react-router-dom';
import './theme';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
