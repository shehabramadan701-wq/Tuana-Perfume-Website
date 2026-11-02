import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // the online preview (GitHub Pages) lives in a sub-folder, so it needs relative paths
  base: mode === 'demo' ? './' : '/',
  server: {
    port: 3000,
    // every request to /api goes to the Node server
    proxy: { '/api': 'http://localhost:5000', '/uploads': 'http://localhost:5000' },
  },
}));
