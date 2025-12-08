import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
// import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['garas-admin.domrey.online'],
  },
  plugins: [react(), tailwindcss()],
});
