import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@huntoru/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@/web': path.resolve(__dirname, './src'),
      '@/api': path.resolve(__dirname, '../api/src'),
    },
  },
});
