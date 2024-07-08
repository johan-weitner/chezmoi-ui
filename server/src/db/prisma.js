import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const app = await prisma.app.create({
    data: {
      JSON: '"act": {    "_bin": "act",    "_desc": "Run GitHub actions locally. More text. ",    "_docs": "https://github.com/nektos/act#example-commands",    "_github": "https://github.com/nektos/act",    "_home": "https://github.com/nektos/act",    "_name": "Act",    "_short": "Act is a tool that allows you to run GitHub Actions locally.",    "brew": "act",    "choco": "act-cli",    "go": "github.com/nektos/act@",    "nix": "nixpkgs.act",    "port": "act",    "scoop": "act",    "yay": "act",    "key": "act",    "tags": "[{\"value\":\"dev\"},{\"value\":\"cli\"}]",    "whalebrew": "",    "apt": "",    "homebrew": "",    "cask": "",    "cargo": "",    "npm": "",    "pip": "",    "pipx": "",    "gem": "",    "script": "",    "winget": "",    "pkgdarwin": "",    "ansible": "",    "binary": "",    "appstore": "",    "edited": true,    "pacman": ""  }'
    },
  })
  console.log(app);

  const apps = await prisma.app.findMany()
  console.log(apps);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })