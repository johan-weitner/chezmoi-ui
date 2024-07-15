
const _isColumnEmpty = (column) => {
  return column === "" || column === null;
};

export const filterNoInstallerApps = (apps) => {
  return apps.filter(item => {
    return _isColumnEmpty(item.whalebrew) &&
      _isColumnEmpty(item.apt) &&
      _isColumnEmpty(item.brew) &&
      _isColumnEmpty(item.cask) &&
      _isColumnEmpty(item.cargo) &&
      _isColumnEmpty(item.npm) &&
      _isColumnEmpty(item.pip) &&
      _isColumnEmpty(item.pipx) &&
      _isColumnEmpty(item.gem) &&
      _isColumnEmpty(item.script) &&
      _isColumnEmpty(item.choco) &&
      _isColumnEmpty(item.scoop) &&
      _isColumnEmpty(item.winget) &&
      _isColumnEmpty(item.pkgdarwin) &&
      _isColumnEmpty(item.ansible) &&
      _isColumnEmpty(item.yay) &&
      _isColumnEmpty(item.appstore) &&
      _isColumnEmpty(item.pacman) &&
      _isColumnEmpty(item.port)
  });
};

export const filterNoUrlsApps = (apps) => {
  return apps.filter((item) => {
    return (
      _isColumnEmpty(item.home) &&
      _isColumnEmpty(item.docs) &&
      _isColumnEmpty(item.github)
    );
  });
};

export const filterNoDescsApps = (apps) => {
  return apps.filter((item) => _isColumnEmpty(item.desc));
};

export const filterNoNamesApps = (apps) => {
  return apps.filter((item) => _isColumnEmpty(item.name));
};