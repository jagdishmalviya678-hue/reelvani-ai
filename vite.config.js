import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      // Forwards /api/* calls from the frontend to the backend server
      // during local development, so the browser only ever talks to
      // the same origin (never sees the AI provider key).
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
