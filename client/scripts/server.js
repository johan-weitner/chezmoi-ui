import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { log } from '../src/utils/logger';

// Initialize express app
const app = express();
const PORT = process.env.FRONTEND_SRV_PORT || 8000; // Use your desired port

// Serve static files from directory ./dist
app.use(express.static('./dist'));

// Proxy /api requests to http://localhost:3000
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
}));

// Start the server
app.listen(PORT, () => {
  log.info(`Server is running on port ${PORT}`);
});