require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors');
const port = 3000;
const YAML = require('yaml');
const fs = require('fs');

const softwareYamlPath = process.env.SOURCE_FILE;
const targetFilePath = process.env.TARGET_FILE;
let softwareArray = [];
let software;

console.log(`softwareYamlPath: ${softwareYamlPath}`);
console.log(`targetFilePath: ${targetFilePath}`);

// Put file reads in functions and call them on boot and whenever a request is made for realted data

const readWorkFile = () => {
  const arr = fs.readFileSync(targetFilePath, 'utf8');
  console.log('Array: ', arr);
  return JSON.parse(arr);
}

if(!softwareYamlPath ||!targetFilePath) {
  console.log('Missing environment variables');
  console.log('Please set SOURCE_FILE and TARGET_FILE');
  process.exit(1);
}

if(!fs.existsSync(softwareYamlPath) && !fs.existsSync(targetFilePath)) {
  console.log('Neither source file nor work file exists ');
  console.log('Please point SOURCE_FILE and TARGET_FILE to existing files');
  process.exit(1);
}

if(fs.existsSync(targetFilePath)) {
  console.log('Work in progress exists - opening WiP:');
  console.log(targetFilePath);

  softwareArray = fs.readFileSync(targetFilePath, 'utf8');
  software = JSON.parse(softwareArray);
} else {
  console.log('Work in progress does not exist - opening source file:');
  console.log(softwareYamlPath);
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
  if(paged === 'true') {
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
  const jsonStr = JSON.stringify(req.body);
  fs.writeFileSync(targetFilePath, jsonStr, 'utf8');
  res.status(200).json(jsonStr);
});

app.listen(port, () => {
  console.log(`\nServer is listening at port ${port}`);
  console.log(`Point your web browser at http://localhost:${port}`);
  console.log('...or whichever port the consuming client is served from');
});
