import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'tailwindcss';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { Provider } from 'react-redux';
import { store } from './store';
import { router } from './routes/router';
import { setupAuthInterceptors } from './store/auth/authService';

// Setup auth interceptors for automatic token refresh
setupAuthInterceptors();

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            zIndex: 99999,
            minWidth: '300px',
          },
        }}
      />
    </Provider>
  </StrictMode>,
);
