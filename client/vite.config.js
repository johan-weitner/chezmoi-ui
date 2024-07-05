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
      api: `${path.resolve(__dirname, "./src/api/")}`,
      // assets: path.resolve(__dirname, "./src/assets"),
      components: `${path.resolve(__dirname, "./src/components/")}`,
      constants: path.resolve(__dirname, "./src/constants"),
      query: path.resolve(__dirname, "./src/query"),
      utils: path.resolve(__dirname, "./src/utils"),
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
