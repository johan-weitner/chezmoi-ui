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
import { seedDb, seedDb2, seedTags, getCount2, getTagCount, addApp, getAllApps, getPage, getAppByKey, updateApp, deleteApp, getCount, isEmptyDb } from "./src/db/prisma.js";
import { tags } from './src/db/fixtures/tags.js';

const app = express();
const port = process.env.BACKEND_SRV_PORT || 3000;
boot();

log.info('Set up db connection...');
const emptyDb = true;  //await isEmptyDb();

const stripWhitespace = (str) => {
  if (!str || typeof str !== 'string') return "";
  return str.replace(/\s/g, '');
};

if (emptyDb) {
  log.info('Empty db - seeding tables...');
  let { software, keys } = setupFileData();
  const data = [];
  const data2 = []
  // keys.forEach((key, index) => {
  //   data.push({ key: key, JSON: JSON.stringify(software[key]) });
  //   data2.push({
  //     key: stripWhitespace(software[key].key),
  //     name: stripWhitespace(software[key]._name),
  //     edited: stripWhitespace(software[key].edited),
  //     desc: stripWhitespace(software[key]._desc),
  //     bin: stripWhitespace(software[key].bin),
  //     short: stripWhitespace(software[key]._short),
  //     home: stripWhitespace(software[key].home),
  //     docs: stripWhitespace(software[key].docs),
  //     github: stripWhitespace(software[key].github),
  //     whalebrew: stripWhitespace(software[key].whalebrew),
  //     apt: stripWhitespace(software[key].apt),
  //     brew: stripWhitespace(software[key].brew),
  //     cask: stripWhitespace(software[key].cask),
  //     cargo: stripWhitespace(software[key].cargo),
  //     npm: stripWhitespace(software[key].npm),
  //     pip: stripWhitespace(software[key].pip),
  //     pipx: stripWhitespace(software[key].pipx),
  //     gem: stripWhitespace(software[key].gem),
  //     script: stripWhitespace(software[key].script),
  //     choco: stripWhitespace(software[key].choco),
  //     scoop: stripWhitespace(software[key].scoop),
  //     winget: stripWhitespace(software[key].winget),
  //     pkgdarwin: stripWhitespace(software[key].pkgdarwin),
  //     ansible: stripWhitespace(software[key].ansible),
  //     binary: stripWhitespace(software[key].binary),
  //     yay: stripWhitespace(software[key].yay),
  //     appstore: stripWhitespace(software[key].appstore),
  //     pacman: stripWhitespace(software[key].pacman),
  //     port: stripWhitespace(software[key].port),
  //   });
  // });
  // log.info(Object.keys(data2[0]));
  // await seedDb(data);
  // await seedDb2(data2);
  // await getCount()
  //   .then((count) => {
  //     log.info(`Done seeding App table with ${count} apps`);
  //   });
  // await getCount2()
  //   .then((count) => {
  //     log.info(`Done seeding Application table with ${count} apps`);
  //   });
  await seedTags(tags);
  await getTagCount()
    .then((count) => {
      log.info(`Done seeding Tag table with ${count} tags`);
    });
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

// app.get('/softwares', (req, res) => {
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
