import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { Chalk } from 'chalk';
import cors from 'cors';
import YAML from 'yaml';
import fs from 'fs';
import { printAppLogo } from './src/logo.js';
import { styles } from './src/util/styles.js';
import { log } from './src/util/log.js';

const app = express();
const port = 3000;

const softwareYamlPath = process.env.SOURCE_FILE;
const targetFilePath = process.env.TARGET_FILE;
const BACKUP_DEPTH = process.env.BACKUP_DEPTH || 5;
const BACKUP_INTERVAL = process.env.BACKUP_INTERVAL || 10;
const backupPaths = [];
let softwareArray = [];
let software;

const { success, warn, error, bold, italic, check, cross, wsign } = styles;

console.clear();
printAppLogo();
log.info('  © 2024 Johan Weitner')

log.info(bold('\n\n-= STARTING BACKEND SERVER... =-\n'));
log.info(bold('Path to source file: ') + softwareYamlPath);
fs.existsSync(softwareYamlPath) ?
  log.success(`Found ${check} \n`) :
  log.error(`Not found ${cross} \n`);
log.info(bold('Path to work file: ') + targetFilePath);
fs.existsSync(targetFilePath) ?
  log.success(`Found ${check} \n`) :
  log.error(`Not found ${cross} \n`);
(process.env.BACKUP_INTERVAL && process.env.BACKUP_INTERVAL > 0) ?
  log.success(`Backup interval set to ${process.env.BACKUP_INTERVAL} min ${check} \n`) :
  log.warn(`${wsign}   Backup interval not set\n`);

const isEmpty = (data) => {
  return Object.keys(data).length === 0;
};

// FIFO container for storing the 5 most recent changes
const addToBackup = (data) => {
  const basePath = targetFilePath.split('.')[0];
  const backupPath = `${basePath}-${new Date().getTime()}.json`;
  try {
    fs.writeFileSync(backupPath, JSON.stringify(data), 'utf8');
    backupPaths.unshift(backupPath);
    if (backupPaths.length > BACKUP_DEPTH) {
      fs.unlinkSync(backupPaths.pop());
    }
  } catch (err) {
    console.error(err);
    return;
  }
};

const readSourceFile = () => {
  const arr = fs.readFileSync(softwareYamlPath, 'utf8');
  const data = YAML.parse(arr);
  if (isEmpty(data)) {
    console.error('Something went wrong - work file is empty');
    return;
  }
  return data;
}

const readWorkFile = () => {
  const arr = fs.readFileSync(targetFilePath, 'utf8');
  const data = JSON.parse(arr);
  if (isEmpty(data)) {
    console.error('Something went wrong - work file is empty');
    return;
  }
  return data;
}

const backupInterval = (process.env.BACKUP_INTERVAL && process.env.BACKUP_INTERVAL > 0) && setInterval(() => {
  const data = readWorkFile();
  addToBackup(data);
}, BACKUP_INTERVAL * 60 * 1000);

if (!softwareYamlPath || !targetFilePath) {
  log.error(error('Missing environment variables'));
  log.error(error('Please set SOURCE_FILE and TARGET_FILE, in either a .env file or in your environment'));
  process.exit(1);
}

if (!fs.existsSync(softwareYamlPath) && !fs.existsSync(targetFilePath)) {
  log.error(error('Neither source file nor work file exists '));
  log.error(error('\x1b[31m%s\x1b[0m', 'Please point SOURCE_FILE and TARGET_FILE to existing files'));
  process.exit(1);
}

if (fs.existsSync(targetFilePath)) {
  log.info('Work in progress exists - opening WiP:');
  log.info(targetFilePath);

  softwareArray = fs.readFileSync(targetFilePath, 'utf8');
  software = JSON.parse(softwareArray);
} else {
  log.info('Work in progress does not exist - opening source file to seed a starting point:');
  log.info(softwareYamlPath);
  const softwareYaml = fs.readFileSync(softwareYamlPath, 'utf8');
  software = YAML.parse(softwareYaml).softwarePackages;
  const keys = Object.keys(software);

  for (let i = 0; i < keys.length; i++) {
    softwareArray.push(software[keys[i]]);
    softwareArray[i].key = keys[i];
  }
}

const paginate = (list, page_size, page_number) => {
  return list.slice((page_number - 1) * page_size, page_number * page_size);
};

app.set('json spaces', 2);
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  res.redirect('/software');
});

app.get('/software', (req, res) => {
  const { paged, page_size, page_number } = req.query;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (paged === 'true') {
    res.json(paginate(arr, page_size, page_number));
  } else {
    res.json(software);
  }
});

app.get('/rawlist', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Content-Type', 'text/plain');

  softwareArray = fs.readFileSync(targetFilePath, 'utf8');
  const yamlData = YAML.stringify(softwareArray);

  res.send(yamlData);
});

app.post('/save', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (isEmpty(req.body)) {
    res.status(500).json({
      error: 'No data provided'
    });
    return;
  }
  try {
    const jsonStr = JSON.stringify(req.body);
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
  log.success(`\nServer is listening at port ${port} `);
  log.info(`Point your web browser at http://localhost:${port}`);
  log.info('...or whichever port the consuming client is served from');
});
