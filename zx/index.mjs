#!/usr/bin/env zx
import 'zx/globals'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagesYamlPath = path.join(__dirname, '..', '.chezmoidata', 'packages.yaml');
const packagesYaml = fs.readFileSync(packagesYamlPath, 'utf8');
const yamlPkgs = YAML.parse(packagesYaml);

// const desktopApps = yamlPkgs.packages.darwin.desktop.sort();
// const structuredArray = [];

// desktopApps.forEach(element => {
//   structuredArray.push({
//     [element]: {
//       name: element,
//       appStoreId: element
//     }
//   });
// });

// const structuredYaml = YAML.stringify(structuredArray);
// const structuredYamlPath = path.join(__dirname, '..', '.chezmoidata',
//   'structuredpackages.yaml');
// fs.writeFileSync(structuredYamlPath, structuredYaml);
// console.log('Structured YAML written to:', structuredYamlPath);


// const brews = yamlPkgs.packages.darwin.brews.sort();
// const brewsArr = brews.map(b => `- ${b}`);

// console.log(JSON.stringify(brewsArr, null, 2));

const n2 = yamlPkgs.packages.darwin.node2.sort();
const strucutredN2 = [];
n2.forEach(element => {
  strucutredN2.push({
    [element]: {
      name: element,
      pkg: element
    }
  });
});

const n2Yaml = YAML.stringify(strucutredN2);
const n2YamlPath = path.join(__dirname, '..', '.chezmoidata',
  'structuredn2.yaml');
fs.writeFileSync(n2YamlPath, n2Yaml);
console.log('Structured YAML written to:', n2YamlPath);