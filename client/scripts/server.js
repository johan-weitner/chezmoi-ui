import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { log } from '../src/utils/logger';

const app = express();
const PORT = process.env.FRONTEND_SRV_PORT || 8000;

app.use(express.static('./dist'));

app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
}));

app.listen(PORT, () => {
  log.info(`Server is running on port ${PORT}`);
});