import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import YAML from 'yaml';
import fs from 'node:fs';
import { boot } from './src/core/boot.js';
import { isEmpty } from './src/core/api.js';
import { log } from './src/util/winston.js';
import { seedDb, seedDb2, seedTags, getCount2, getTagCount, addApp, getAllApps, getPage, getAppByKey, updateApp, deleteApp, getCount, isEmptyDb } from "./src/db/prisma.js";
import { tags } from './src/db/fixtures/tags.js';

const app = express();
const port = process.env.BACKEND_SRV_PORT || 3000;
boot(); // Set up auxillary infrastructure

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
  attachHeaders(res).redirect('/software');
});

app.get('/software', (req, res) => {
  getAllApps()
    .then((apps) => {
      attachHeaders(res).json(apps);
    });
});

app.get('/getCount', (req, res) => {
  getCount()
    .then((count) => {
      attachHeaders(res).json({ count: count });
    });
});

app.post('/page', (req, res) => {
  const { body: { skip, take } } = req;
  getPage(Number.parseInt(skip, 10), Number.parseInt(take, 10))
    .then((apps) => {
      attachHeaders(res).json(apps);
    });
});

app.get('/rawlist', (req, res) => {
  attachHeaders(res).set('Content-Type', 'text/plain');

  softwareArray = fs.readFileSync(targetFilePath, 'utf8');
  const yamlData = YAML.stringify(softwareArray);

  res.send(yamlData);
});

app.get('/getApp', (req, res) => {
  const { key } = req.query;
  getAppByKey(key)
    .then((app) => {
      attachHeaders(res).json(app);
    });
});

app.post('/updateNode', (req, res) => {
  const { body } = req;
  const { key } = body;
  if (isEmpty(body)) {
    res.status(500).json({
      error: 'No data provided'
    });
    return;
  }
  updateApp(key, JSON.stringify(body))
    .then((app) => {
      attachHeaders(res).status(200).json(jsonStr);
    })
    .catch((e) => {
      res.status(500).json({
        error: e.message
      });
    });
});

app.post('/addNode', (req, res) => {
  console.log('Req.body: ', req.body);
  const { params } = req.body;
  const { key } = params;
  const { values, keepDirty, keepDirtyFields, keepValues, keepDefaultValues, ...newParams } = params;
  console.log('Req params: ', newParams);
  addApp(key, JSON.stringify(params))
    .then((app) => {
      attachHeaders(res).status(200).json(app);
    })
    .catch((e) => {
      res.status(500).json({
        error: e.message
      });
    })
});

app.delete('/deleteNode', (req, res) => {
  deleteApp(req.query.key)
    .then((result) => {
      attachHeaders(res).status(200).json(result);
    })
    .catch((e) => {
      res.status(500).json({
        error: e.message
      });
    })
});

app.post('/save', (req, res) => {
  if (isEmpty(req.body)) {
    attachHeaders(res).status(500).json({
      error: 'No data provided'
    });
    return;
  }
  try {
    const jsonStr = JSON.stringify(req.body, null, 2);
    fs.writeFileSync(targetFilePath, jsonStr, 'utf8');
    attachHeaders(res).status(200).json(jsonStr);
  } catch (err) {
    attachHeaders(res).status(500).json({
      error: err
    });
    return;
  }
});

app.listen(port, () => {
  log.info(`\nServer is listening at port ${port} `);
});
