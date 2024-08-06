import { appModelInstallerFields } from "api/appModel";
import { APP_FORM, EMPTY_APP } from "constants/appForm";
import { log } from 'utils/logger';
import { useGroupManager } from "core/GroupManager";

const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";
const { getGroupId } = useGroupManager();

/**
 * Helper functions
 */
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

export const mapEntityToDb = (app) => {
	log.info(
		`Mapping app data to database entity:
		- App:`,
		app);
	// const { ApplicationGroup } = app;
	// const groups = ApplicationGroup.map((group) => {
	// 	return getGroupId(group);
	// });
	const { formPartOne, formPartTwo } = APP_FORM;
	const validKeys = [...formPartOne, ...formPartTwo, "done"].map((item) => item.name);
	const entity = {};
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
