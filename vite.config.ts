import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [ process.env.VITE_ADMIN_HOST || 'localhost' ],
    proxy: {
      '/api': {
        target: process.env.VITE_API_HOST,
        changeOrigin: true,
        secure: false,
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log('Proxying:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Response:', proxyRes.statusCode, req.url);
          });
          proxy.on('error', (err, req) => {
            console.log('Proxy error:', err.message, req.url);
          });
        },
      },
      '/uploads': {
        target: process.env.VITE_API_HOST,
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: process.env.VITE_API_HOST,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'router-vendor';
          }
          if (
            id.includes('node_modules/@reduxjs/toolkit') ||
            id.includes('node_modules/react-redux')
          ) {
            return 'redux-vendor';
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/react-icons')) {
            return 'ui-vendor';
          }
          if (id.includes('node_modules/axios')) {
            return 'http-vendor';
          }
          if (id.includes('node_modules/tailwindcss') || id.includes('node_modules/@tailwindcss')) {
            return 'tailwind-vendor';
          }
        },
      },
    },
  },
  plugins: [react()],
});
