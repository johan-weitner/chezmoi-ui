const express = require('express')
const app = express();
const cors = require('cors');
const port = 3000;
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');


// BREWS
// CASKS
// CARGO
// BINARIES
// MAS
// NODE
// SCRIPTS
// COMMANDS
// GIT
// PIP
// PIPX
// GEM
// GO
// pre.brews, pre.onepassword, brews, casks, cargo, binaries, mas, node, scripts, commands, git, pip, pipx, gem, go

const packagesYamlPath = '/Users/johanweitner/.local/share/chezmoi/.chezmoidata/packages.yaml';
const packagesYaml = fs.readFileSync(packagesYamlPath, 'utf8');
const packages = YAML.parse(packagesYaml);

const softwareYamlPath = '/Users/johanweitner/.local/share/chezmoi/.chezmoidata/software.yml';
const softwareYaml = fs.readFileSync(softwareYamlPath, 'utf8');
const software = YAML.parse(softwareYaml);

const mergedYamlPath = '/Users/johanweitner/.local/share/chezmoi/.chezmoidata/merged.yml';
const mergedYaml = fs.readFileSync(softwareYamlPath, 'utf8');
const merged = YAML.parse(softwareYaml);

// console.log(packages);
// console.log(software);
console.log(merged);

const {
  packages: {
    taps,
    darwin: {
      pre: {
        brews: prebrews,
        onepassword: preonepassword
      },
      brews, casks, cargo, binaries, mas, node, scripts, commands, git, pip, pipx, gem, go
    }
  }
} = packages;

const getStringArray = arr => {
  return arr.reduce((acc, current) => [...acc, current.name], []);
};

const nullCheck = arr => {
  return arr ? arr : [];
};

console.log(brews, casks, cargo, binaries, mas, node, scripts, commands, git, pip, pipx, gem, go);

const allApps = [...new Set([
  ...nullCheck(prebrews),
  preonepassword.name,
  ...nullCheck(brews),
  ...nullCheck(casks),
  ...nullCheck(cargo),
  ...getStringArray(nullCheck(binaries)),
  ...getStringArray(nullCheck(mas)),
  ...getStringArray(nullCheck(node)),
  ...getStringArray(nullCheck(scripts)),
  ...getStringArray(nullCheck(commands)),
  ...getStringArray(nullCheck(git)),
  ...nullCheck(pip),
  ...nullCheck(pipx),
  ...nullCheck(gem),
  ...nullCheck(go)
])];


// Read software.yaml, iterate software list, if item exists in allApps, add to new array.
// If missing, add item from allApps, with same object structure - for filling out later, in UI


app.set('json spaces', 2);
app.use(cors());
//
// Serve static files from the "public" sub-directory.
//
// app.use(express.static("public"));

// expose "pkgs" endpoint and let it serve yamlPkgs as a JSON payload
app.get('/', (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET'); // Allow GET method
  res.header('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header

  res.json(packages);
});

app.get('/all', (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET'); // Allow GET method
  res.header('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header

  res.json(allApps);
});

app.get('/software', (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET'); // Allow GET method
  res.header('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header

  res.json(software);
});

app.get('/merged', (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET'); // Allow GET method
  res.header('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header

  res.json(merged);
});


//
// Start the web server.
//
app.listen(port, () => {
    console.log(`Point your web browser at http://localhost:${port}`);
});