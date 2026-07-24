import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { affiliateResolvePlugin } from './vite-plugin-affiliate-resolve';
import { affiliateProductsPlugin } from './server/vite-plugin-affiliate-products';

const port = Number(process.env.PORT || 5173);
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    affiliateResolvePlugin(),
    affiliateProductsPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: ['atmosclima.com', 'www.atmosclima.com'],
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: ['atmosclima.com', 'www.atmosclima.com'],
  },
});
