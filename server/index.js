import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import YAML from 'yaml';
import fs from 'fs';
import winston from 'winston';
import { targetFilePath } from './src/core/config.js';
import { boot } from './src/core/boot.js';
import { isEmpty } from './src/core/api.js';

const log = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  log.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const app = express();
const port = process.env.BACKEND_SRV_PORT || 3000;
let { softwareArray, software, backupPaths, keys } = boot();

app.set('json spaces', 2);
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const attachHeaders = (res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  return res;
};

app.get('/', (req, res) => {
  res = attachHeaders(res);
  res.redirect('/software');
});

app.get('/software', (req, res) => {
  // const { paged, page_size, page_number } = req.query;
  res = attachHeaders(res);
  res.json(software);
});

app.get('/softwareKeys', (req, res) => {
  res = attachHeaders(res);
  res.json(keys);
});

app.get('/backups', (req, res) => {
  res = attachHeaders(res);
  res.json(backupPaths);
});

app.get('/rawlist', (req, res) => {
  res = attachHeaders(res);
  res.set('Content-Type', 'text/plain');

  softwareArray = fs.readFileSync(targetFilePath, 'utf8');
  const yamlData = YAML.stringify(softwareArray);

  res.send(yamlData);
});

app.get('/getApp', (req, res) => {
  const { key } = req.query;
  res = attachHeaders(res);
  res.json(software[key]);
});

app.post('/updateNode', (req, res) => {
  log.info('Called /updateNode');
  res = attachHeaders(res);
  const { body } = req;
  log.info('Incoming payload: ', JSON.stringify(body, null, 2));
  if (isEmpty(body)) {
    res.status(500).json({
      error: 'No data provided'
    });
    return;
  }
  try {
    software[body.key] = { ...body };
    const jsonStr = JSON.stringify(software, null, 2);
    fs.writeFileSync(targetFilePath, jsonStr, 'utf8');
    res.status(200).json(jsonStr);
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: err
    });
    return;
  }
});

app.post('/addNode', (req, res) => {
  res = attachHeaders(res);
  const { body } = req;
  if (isEmpty(body)) {
    res.status(500).json({
      error: 'No data provided'
    });
    return;
  }
  try {
    software = {
      ...software,
      body
    };
    const jsonStr = JSON.stringify(software, null, 2);
    fs.writeFileSync(targetFilePath, jsonStr, 'utf8');
    res.status(200).json(jsonStr);
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: err
    });
    return;
  }
});

app.post('/save', (req, res) => {
  res = attachHeaders(res);
  if (isEmpty(req.body)) {
    res.status(500).json({
      error: 'No data provided'
    });
    return;
  }
  try {
    const jsonStr = JSON.stringify(req.body, null, 2);
    fs.writeFileSync(targetFilePath, jsonStr, 'utf8');
    res.status(200).json(jsonStr);
  } catch (err) {
    res.status(500).json({
      error: err
    });
    return;
  }
});

app.listen(port, () => {
  log.info(`\nServer is listening at port ${port} `);
});
