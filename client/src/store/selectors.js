import { findIndexByKey } from "api/helpers";
import { createSelector } from "reselect";
const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE;
const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";
import { useDispatch } from "react-redux";
import { useSelector } from "store/store";
import {
	getState,
	store,
	setSelectedAppKey,
} from "store/store";
import { filterModel } from "api/filterApi";

const { dispatch } = store;

export const getAppCollection = getState().appCollection;
export const getPage = getState().page;
export const getPageCount = getState().pageCount;
export const getPageContent = getState().pageContent;
export const getPageSize = getState().pageSize;
export const getInReverse = getState().inReverse;
export const getFilterModel = getState().filterModel;
export const getActiveFilter = getState().activeFilter;
export const getSelectedApp = getState().selectedApp;
export const getSelectedAppKey = getState().selectedAppKey;
export const getEditMode = getState().editMode;

export const getSearchBase = () => {
	const appCollection = getState().appCollection;
	return appCollection?.map((app) => {
		return {
			id: app.key,
			label: app.name,
			description: app.short
		};
	});
};

export const getPreviousKey = (state) => {
	const appCollection = getState().appCollection;
	const index = getCurrentIndex();
	if (index > 0) {
		return appCollection[index - 1].key;
	}
	return appCollection[0].key;
};

export const getNextKey = () => {
	const index = getCurrentIndex();
	const totalCount = getState().totalCount;
	const appCollection = getState().appCollection;
	if (index < totalCount - 1) {
		return appCollection[index + 1].key;
	}
	return appCollection[appCollection?.length - 1].key;
};

export const selectPageContent = () => {
	const { appCollection, page, inReverse } = getState();
	const skip = page < 2 ? 0 : (page - 1) * PAGE_SIZE;
	const cutoff = skip + Number.parseInt(PAGE_SIZE, 10);
	const slice =
		(Array.isArray(appCollection) &&
			appCollection.length > 20 &&
			appCollection.slice(skip, cutoff)) ||
		[];
	dispatch(setSelectedAppKey(inReverse ? slice[slice.length - 1]?.key : slice[0]?.key));
	return slice;
};

export const getCurrentIndex = () => {
	const appCollection = getState().appCollection;
	const selectedAppKey = getState().selectedAppKey;
	return findIndexByKey(selectedAppKey, appCollection);
};

export const selectApp = (selectedAppKey) => {
	const appCollection = getState().appCollection;
	return appCollection.find((app) => app.key === selectedAppKey);
};

export const selectAppByKey = (key) => {
	const appCollection = getState().appCollection;
	const app = appCollection.find((app) => app.key === key);
	if (!app) {
		throw new Error(`App with key ${key} not found`);
	}
	return app;
};

export const getAppById = (id) => {
	const appCollection = getState().appCollection;
	const app = appCollection.find((app) => app.id === id);
	if (!app) {
		throw new Error(`App with id ${id} not found`);
	}
	return app;
};

export const getSelectedGroupId = () => {
	const selectedGroupKey = getState().selectedGroupKey;
	const appGroups = getState().appGroups;
	const group = appGroups.find((group) => group.name === selectedGroupKey);
	return group?.id;
};

