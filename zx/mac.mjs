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

console.log(yamlPkgs);
let firstRun = true;
const {
  packages: {
    taps,
    linux: {
      pre
    }
  }
} = yamlPkgs;

const firstrunPath = path.join(os.homedir(), '.local', 'share', 'chezmoi', 'firstrun');
if (fs.existsSync(firstrunPath)) {
  firstRun = false;
}
console.log('First run: ', firstRun);


const doTaps = () => {
  if(firstRun) {
    taps.forEach((item) => {
      console.log(`Tapping ${item}`);
      $`brew tap ${item}`;
    });
  }
};







doTaps();