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
    darwin: {
      pre
    }
  }
} = yamlPkgs;

const firstrunPath = path.join(os.homedir(), '.local', 'share', 'chezmoi', 'firstrun');
if (fs.existsSync(firstrunPath)) {
  firstRun = false;
}
// console.log('First run: ', firstRun);


const doTaps = () => {
  if(firstRun) {
    taps.forEach((item) => {
      console.log(`Tapping ${item}`);
      $`brew tap ${item}`;
    });
  }
};

const installPreReqs = () => {
  console.log(pre);
  const { onepassword, brews } = pre;

  brews.forEach(async (item) => {
    console.log(`Installing ${item}`);
    await $`
      if ! which brew &> /dev/null; then
        brew install ${item}
      fi
    `;
  });


};

const installOnePassword = () => {
  // # 1Password Setup
  // if [ -d /Applications/1Password.app ]; then
  //   echo "1Password already installed. Skipping..."
  // else
  //   echo "Setting up 1Password..."
  //   echo "Fetching 1Password archive..."
  //   wget {{ .packages.darwin.pre.onepassword }}

  //   printf "\n\n"
  //   echo "Unpacking 1Password archive..."
  //   unzip 1Password.zip
  //   rm -f 1Password.zip

  //   printf "\n\n"
  //   echo "Starting 1Password installer..."
  //   ./1Password\ Installer.app/Contents/MacOS/1Password\ Installer

  //   printf "\n\n"
  //   echo "Authenticating account..."
  //   open "$(cat $HOME/.config/vault/op.url)"
  // fi
};



doTaps();
installPreReqs();