import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // AI chat backend (optional separate service) — also reachable directly
      // via VITE_API_BASE_URL from src/services/api.js.
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // tojibox-api (FastAPI) — oracle/parcel/verify/x402 routes.
      // Default port matches tojibox-api's .env.example (FastAPI on :8001).
      '/oracle': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oracle/, '/api/oracle'),
      },
    },
  },
});
