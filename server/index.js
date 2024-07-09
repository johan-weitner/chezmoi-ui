import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import YAML from 'yaml';
import fs from 'fs';
import { targetFilePath } from './src/core/config.js';
import { boot, setupFileData } from './src/core/boot.js';
import { isEmpty } from './src/core/api.js';
import { log } from './src/util/winston.js';
import { seedDb, addApp, getAllApps, getPage, getAppByKey, updateApp, deleteApp, getCount, isEmptyDb } from "./src/db/prisma.js";

const app = express();
const port = process.env.BACKEND_SRV_PORT || 3000;
boot();

log.info('Set up db connection...');
const emptyDb = await isEmptyDb();

if (emptyDb) {
  log.info('Empty db - seeding...');
  let { software, keys } = setupFileData();
  const data = [];
  keys.forEach((key) => {
    data.push({ key: key, JSON: JSON.stringify(software[key]) });
  });
  await seedDb(data);
  await getCount()
    .then((count) => {
      log.info(`Done seeding db with ${count} apps`);
    })
}

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
  getAllApps()
    .then((apps) => {
      res = attachHeaders(res);
      res.json(apps);
    });
});

app.get('/getCount', (req, res) => {
  getCount()
    .then((count) => {
      res = attachHeaders(res);
      res.json({ count: count });
    });
});

app.post('/page', (req, res) => {
  const { body: { skip, take } } = req;
  getPage(parseInt(skip, 10), parseInt(take, 10))
    .then((apps) => {
      res = attachHeaders(res);
      res.json(apps);
    });
});

// app.get('/softwareKeys', (req, res) => {
//   res = attachHeaders(res);
//   res.json(keys);
// });

// app.get('/backups', (req, res) => {
//   res = attachHeaders(res);
//   res.json(backupPaths);
// });

app.get('/rawlist', (req, res) => {
  res = attachHeaders(res);
  res.set('Content-Type', 'text/plain');

  softwareArray = fs.readFileSync(targetFilePath, 'utf8');
  const yamlData = YAML.stringify(softwareArray);

  res.send(yamlData);
});

app.get('/getApp', (req, res) => {
  const { key } = req.query;
  getAppByKey(key)
    .then((app) => {
      res = attachHeaders(res);
      res.json(app);
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
      res = attachHeaders(res);
      res.status(200).json(jsonStr);
    })
    .catch((e) => {
      res.status(500).json({
        error: e.message
      });
    });
});

app.post('/addNode', (req, res) => {
  const { body: { key } } = req;
  console.log('Body: ', body);
  addApp(key, JSON.stringify(body))
    .then((app) => {
      res = attachHeaders(res);
      res.status(200).json(app);
    })
    .catch((e) => {
      res.status(500).json({
        error: e.message
      });
    })
});

app.delete('/deleteNode', (req, res) => {
  // const { key } = req.query;
  deleteApp(req.query.key)
    .then((result) => {
      res = attachHeaders(res);
      res.status(200).json(result);
    })
    .catch((e) => {
      res.status(500).json({
        error: e.message
      });
    })
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
