import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['garas-admin.domrey.online'],
    proxy: {
      // forward /api/* to the real backend to avoid CORS during development
      '/api': {
        target: 'https://garas-api.domrey.online',
        changeOrigin: true,
        secure: false,
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Proxying:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Response:', proxyRes.statusCode, req.url);
          });
          proxy.on('error', (err, req, _res) => {
            console.log('Proxy error:', err.message, req.url);
          });
        },
      },
      // Proxy images and uploads to bypass SSL certificate issues
      // These don't strip the path prefix
      '/uploads': {
        target: 'https://garas-api.domrey.online',
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: 'https://garas-api.domrey.online',
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
