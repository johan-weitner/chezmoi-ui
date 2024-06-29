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


if(fs.existsSync(targetFilePath)) {
  console.log('Work in progress exists - opening WiP...');
  softwareArray = fs.readFileSync(targetFilePath, 'utf8');
  software = JSON.parse(softwareArray);
} else {
  console.log('Work in progress does not exist - opening source file...');
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

// const getStringArray = arr => {
//   return arr.reduce((acc, current) => [...acc, current.name], []);
// };

// const nullCheck = arr => {
//   return arr ? arr : [];
// };

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
    res.json(paginate(softwareArray, page_size, page_number));
  } else {
    res.json(software);
  }
});

app.post('/save', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  const jsonStr = JSON.stringify(req.body);
  // const filePath = `/Users/johanweitner/.local/share/chezmoi/backup_${new Date().getTime()}.yml`;
  // fs.writeFileSync(filePath, yamlStr, 'utf8');
  fs.writeFileSync(targetFilePath, jsonStr, 'utf8');
  res.sendStatus(200);
});

//
// Start the web server.
//
app.listen(port, () => {
  console.log(`Point your web browser at http://localhost:${port}`);
  console.log('...or whichever port the consuming client is served from');
});
