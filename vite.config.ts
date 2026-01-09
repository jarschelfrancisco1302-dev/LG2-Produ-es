import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This ensures assets are linked relatively (e.g. "./assets/..." instead of "/assets/...")
  // allowing the app to work in a subdirectory (like https://user.github.io/repo/).
  base: './',
  server: {
    port: 3000,
  }
});