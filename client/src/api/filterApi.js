import { getState } from "store/store";
import { log } from 'utils/logger';
import { appHasInstaller } from "api/helpers";

export const isColumnEmpty = (column) => {
	return column === "" || column === null;
};

export const filterNoInstallerApps = () => {
	const apps = getState().appCollection;
	return apps.filter((item) => {
		if (!appHasInstaller(item)) {
			return item;
		}
	});
};

export const filterNoUrlsApps = () => {
	const apps = getState().appCollection;
	log.debug("Apps: ", apps);
	return apps.filter((item) => {
		return (
			isColumnEmpty(item.home) &&
			isColumnEmpty(item.docs) &&
			isColumnEmpty(item.github)
		);
	});
};

export const filterNoDescsApps = () => {
	const apps = getState().appCollection;
	return apps.filter((item) => isColumnEmpty(item.desc));
};

export const filterNoNamesApps = () => {
	const apps = getState().appCollection;
	return apps.filter((item) => isColumnEmpty(item.name));
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
