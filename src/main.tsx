import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'tailwindcss';
import { RouterProvider } from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from './store';
import { router } from './routes/router';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
