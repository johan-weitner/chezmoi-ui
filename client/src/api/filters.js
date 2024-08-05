import { useDispatch } from "react-redux";
import { useSelector } from "store/store";
import { store, getState } from "store/store";
import { log } from 'utils/logger';

const _isColumnEmpty = (column) => {
	return column === "" || column === null;
};

export const filterNoInstallerApps = () => {
	const apps = getState().appCollection;
	return apps.filter((item) => {
		return (
			_isColumnEmpty(item.whalebrew) &&
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
		);
	});
};

export const filterNoUrlsApps = () => {
	const apps = getState().appCollection;
	log.debug("Apps: ", apps);
	return apps.filter((item) => {
		return (
			_isColumnEmpty(item.home) &&
			_isColumnEmpty(item.docs) &&
			_isColumnEmpty(item.github)
		);
	});
};

export const filterNoDescsApps = () => {
	const apps = getState().appCollection;
	return apps.filter((item) => _isColumnEmpty(item.desc));
};

export const filterNoNamesApps = () => {
	const apps = getState().appCollection;
	return apps.filter((item) => _isColumnEmpty(item.name));
};

export const filterModel = {
	installers: {
		key: "installers",
		title: "Apps without installers",
	},
	urls: {
		key: "urls",
		title: "Apps without URLs",
	},
	name: {
		key: "name",
		title: "Apps without name",
	},
	desc: {
		key: "desc",
		title: "Apps without description",
	},
};
