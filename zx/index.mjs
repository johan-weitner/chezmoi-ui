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

const desktopApps = yamlPkgs.packages.darwin.desktop.sort();
const structuredArray = [];

desktopApps.forEach(element => {
  structuredArray.push({
    [element]: {
      name: element,
      appStoreId: element
    }
  });
});

const structuredYaml = YAML.stringify(structuredArray);
const structuredYamlPath = path.join(__dirname, '..', '.chezmoidata',
  'structuredpackages.yaml');
fs.writeFileSync(structuredYamlPath, structuredYaml);
console.log('Structured YAML written to:', structuredYamlPath);


// const brews = yamlPkgs.packages.darwin.brews.sort();
// const brewsArr = brews.map(b => `- ${b}`);

// console.log(JSON.stringify(brewsArr, null, 2));