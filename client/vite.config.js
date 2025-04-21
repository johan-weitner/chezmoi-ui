import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "node:path";

dotenv.config();

// https://vitejs.dev/config/ // add env varible specified in .env file
/** @type {import('vite').UserConfig} */
export default defineConfig({
  sourcemap: true,
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
    host: '0.0.0.0',
    port: process.env.FRONTEND_SRV_PORT || 8000,
    strictPort: true,
    hmr: {
      clientPort: 8000
    }
  },
  env: {
    DEBUG: process.env.DEBUG || false,
  }
});
