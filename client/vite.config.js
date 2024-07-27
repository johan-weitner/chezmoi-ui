import dotenv from 'dotenv';
dotenv.config();
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "node:path";

// https://vitejs.dev/config/ // add env varible specified in .env file

export default defineConfig({
  plugins: [
    react()
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  resolve: {
    alias: {
      api: `${path.resolve(__dirname, "./src/api/")}`,
      components: `${path.resolve(__dirname, "./src/components/")}`,
      constants: path.resolve(__dirname, "./src/constants"),
      core: path.resolve(__dirname, "./src/core"),
      query: path.resolve(__dirname, "./src/query"),
      store: path.resolve(__dirname, "./src/store"),
      utils: path.resolve(__dirname, "./src/utils"),
      views: path.resolve(__dirname, "./src/views"),
    }
  },
  server: {
    port: process.env.FRONTEND_SRV_PORT || 8000,
    strictPort: true
  },
  env: {
    DEBUG: process.env.DEBUG || false,
  },
})
