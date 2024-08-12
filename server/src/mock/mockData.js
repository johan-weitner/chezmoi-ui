

export const mockAppSrc = {
  appKey: {
    key: "appKey",
    _name: "App Name",
    edited: false,
    done: false,
    _desc: "App Description",
    _bin: "binary",
    _short: "Short desc",
    _home: "https://app.com",
    _docs: "https://app.com/docs",
    _github: "https://github.com/app",
    whalebrew: "",
    apt: "",
    brew: "",
    cask: "",
    cargo: "",
    npm: "",
    pip: "",
    pipx: "",
    gem: "",
    script: "",
    choco: "",
    scoop: "",
    winget: "",
    pkgdarwin: "",
    ansible: "",
    binary: "",
    yay: "",
    appstore: "",
    pacman: "",
    port: "",
  }
};

const extendedApp = {
  edited: false,
  done: false,
  desc: "App Description",
  bin: "binary",
  short: "Short desc",
  home: "https://app.com",
  docs: "https://app.com/docs",
  github: "https://github.com/app",
  whalebrew: "",
  apt: "",
  brew: "",
  cask: "",
  cargo: "",
  npm: "",
  pip: "",
  pipx: "",
  gem: "",
  script: "",
  choco: "",
  scoop: "",
  winget: "",
  pkgdarwin: "",
  ansible: "",
  binary: "",
  yay: "",
  appstore: "",
  pacman: "",
  port: "",
}

export const mockApp = {
  key: "appKey",
  name: "App Name",
  ...extendedApp
};

export const mockAppCollection = [
  {
    key: "appKey",
    name: "App Name",
    ...extendedApp
  },
  {
    key: "appKey2",
    name: "App Name 2",
    ...extendedApp
  },
  {
    key: "appKey3",
    name: "App Name 3",
    ...extendedApp
  }
];

export const mockGroups = {
  Group1: {
    id: 1,
    name: "group1"
  },
  Group2: {
    id: 2,
    name: "group2"
  }
};