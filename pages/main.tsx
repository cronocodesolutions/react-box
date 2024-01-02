import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import './theme';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
