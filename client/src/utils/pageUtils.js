import { appModelInstallerFields } from "api/appModel";

export const isStartOfPage = (index) => {
	return index === 0;
};

export const isEndOfPage = (index, ofTotalLength) => {
	return index === ofTotalLength - 1;
};

export const findIndex = (key, list) => {
	return list.findIndex((item) => item.key === key);
};

export const isNullOrEmpty = (value) => {
	return value === null || value === undefined || value === "";
};

export const appHasInstaller = (app) => {
	for (const field of appModelInstallerFields) {
		if (app && !isNullOrEmpty(app[field])) {
			return true;
		}
	}
	return false;
};
