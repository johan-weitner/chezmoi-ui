import dotenv from 'dotenv';
dotenv.config();
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: `${path.resolve(__dirname, "./src/components/")}`,
      assets: path.resolve(__dirname, "./src/assets"),
      utils: path.resolve(__dirname, "./src/utils"),
      constants: path.resolve(__dirname, "./src/constants")
    }
  },
  server: {
    port: process.env.SERVER_PORT || 8080,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
