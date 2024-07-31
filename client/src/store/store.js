import { filterModel } from "api/filters";
import { createStore } from "zustand-x";

export const useStore = () => { };

const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE, 10);
export const MAIN_VIEWS = ["apps", "groups", "tags", "settings"];

export const rootStore = createStore("root")({
	mainView: MAIN_VIEWS[0],
	appCollection: null,
	appGroups: [],
	appGroupKeys: [],
	totalCount: 0,
	page: 0,
	pageCount: 0,
	pageContent: null,
	getTotalSize: (state) => state.appCollection?.length || 0,
	pageSize: PAGE_SIZE,
	inReverse: false,
	filterModel: filterModel,
	activeFilter: null,
	filteredList: null,
	selectedApp: null,
	selectedAppKey: null,
	selectedAppTags: null,
	selectedGroup: null,
	selectedGroupKey: null,
	selectedGroupId: null,
	appsInSelectedGroup: null,
	allowedTags: null,
	editMode: false,
	isNewApp: false,
	isLoading: false,
	error: null,
	middlewares: ["devtools"],
});

const getState = () => {
	return rootStore.store.getState();
};

