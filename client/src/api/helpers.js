import { appModelInstallerFields } from "api/appModel";
import { APP_FORM } from "constants/appForm";
import { log } from 'utils/logger';

/**
 * Helper functions
 */
export const isStartOfPage = (index) => {
	return index === 0;
};

export const isEndOfPage = (index, ofTotalLength) => {
	return index === ofTotalLength - 1;
};

export const findIndexByKey = (key, list) => {
	return list.findIndex((item) => item.key === key);
};

export const findIndexById = (id, list) => {
	return list.findIndex((item) => item.id === id);
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

export const mapEntityToDb = (app) => {
	log.debug(
		`Mapping app data to database entity:
		- App:`,
		app);

	const { formPartOne, formPartTwo } = APP_FORM;
	const validKeys = [...formPartOne, ...formPartTwo, "done"].map((item) => item.name);
	const entity = {
		id: app.id,
		desc: app.desc,
		done: app.done,
		edited: true
	};
	Object.keys(app).map((key) => {
		if (validKeys.includes(key)) {
			entity[key] = app[key];
		}
	});
	log.debug(
		`Mapped app data:
    - Entity:`,
		entity,
	);
	return entity;
};

export const transformNullValues = (app) => {
	for (const key of Object.keys(app)) {
		if (app[key] === null || app[key] === undefined) {
			app[key] = "";
		}
	}
	return app;
};
