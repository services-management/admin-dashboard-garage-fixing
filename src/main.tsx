import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'tailwindcss';
import { RouterProvider } from 'react-router-dom';

import { router } from './routes/router';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
