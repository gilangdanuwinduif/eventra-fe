import React from 'react'
import './index.css'; // Use index.css for global styles
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
