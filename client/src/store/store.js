import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import { filterModel } from "api/filters";
import { createTrackedSelector } from 'react-tracked';

const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE, 10);
export const MAIN_VIEWS = ["apps", "groups", "tags", "settings"];

const initialState = {
	mainView: MAIN_VIEWS[0],
	appCollection: null,
	appGroups: [],
	appGroupKeys: [],
	totalCount: 0,
	page: 0,
	pageCount: 0,
	pageContent: null,
	pageSize: PAGE_SIZE,
	inReverse: false,
	activeFilter: null,
	filteredList: null,
	selectedApp: null,
	selectedAppKey: null,
	selectedAppTags: null,
	selectedAppGroups: null,
	selectedGroup: null,
	selectedGroupKey: null,
	selectedGroupId: null,
	appsInSelectedGroup: null,
	allowedTags: null,
	editMode: false,
	isNewApp: false,
	hideCompleted: false,
	isLoading: false,
	error: null,
};

const rootSlice = createSlice({
	name: 'root',
	initialState,
	reducers: {
		setMainView: (state, action) => { state.mainView = action.payload; },
		setAppCollection: (state, action) => { state.appCollection = action.payload; },
		setAppGroups: (state, action) => { state.appGroups = action.payload; },
		setAppGroupKeys: (state, action) => { state.appGroupKeys = action.payload; },
		setTotalCount: (state, action) => { state.totalCount = action.payload; },
		setPage: (state, action) => { state.page = action.payload; },
		setPageCount: (state, action) => { state.pageCount = action.payload; },
		setPageContent: (state, action) => { state.pageContent = action.payload; },
		setInReverse: (state, action) => { state.inReverse = action.payload; },
		setActiveFilter: (state, action) => { state.activeFilter = action.payload; },
		setFilteredList: (state, action) => { state.filteredList = action.payload; },
		setSelectedApp: (state, action) => { state.selectedApp = action.payload; },
		setSelectedAppKey: (state, action) => { state.selectedAppKey = action.payload; },
		setSelectedAppTags: (state, action) => { state.selectedAppTags = action.payload; },
		setSelectedAppGroups: (state, action) => { state.selectedAppGroups = action.payload; },
		setSelectedGroup: (state, action) => { state.selectedGroup = action.payload; },
		setSelectedGroupKey: (state, action) => { state.selectedGroupKey = action.payload; },
		setSelectedGroupId: (state, action) => { state.selectedGroupId = action.payload; },
		setAppsInSelectedGroup: (state, action) => { state.appsInSelectedGroup = action.payload; },
		setAllowedTags: (state, action) => { state.allowedTags = action.payload; },
		setEditMode: (state, action) => { state.editMode = action.payload; },
		setIsNewApp: (state, action) => { state.isNewApp = action.payload; },
		setHideCompleted: (state, action) => { state.hideCompleted = action.payload; },
		setIsLoading: (state, action) => { state.isLoading = action.payload; },
		setError: (state, action) => { state.error = action.payload; },
	},
});

export const {
	setMainView,
	setAppCollection,
	setAppGroups,
	setAppGroupKeys,
	setTotalCount,
	setPage,
	setPageCount,
	setPageContent,
	setInReverse,
	setActiveFilter,
	setFilteredList,
	setSelectedApp,
	setSelectedAppKey,
	setSelectedAppTags,
	setSelectedAppGroups,
	setSelectedGroup,
	setSelectedGroupKey,
	setSelectedGroupId,
	setAppsInSelectedGroup,
	setAllowedTags,
	setEditMode,
	setIsNewApp,
	setHideCompleted,
	setIsLoading,
	setError,
} = rootSlice.actions;


export const store = configureStore({
	reducer: {
		root: rootSlice.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
	devTools: process.env.NODE_ENV !== 'production',
});

const useTrackedSelector = createTrackedSelector(useSelector);

export const useStore = () => {
	const dispatch = useDispatch();
	const state = useTrackedSelector((state) => state.root);

	return { state, dispatch };
};

const useCustomTrackedSelector = (selector) => {
	const state = useTrackedSelector();
	return selector(state);
};

export const getState = () => {
	return store.getState().root;
};

export { useCustomTrackedSelector as useSelector };

// const e = {
// 	"stack": `Error\n    at http://localhost:8000/node_modules/.vite/deps/react-redux.js?v=7d575e32:224:25\n
// 	at memoizedSelector (http://localhost:8000/node_modules/.vite/deps/react-redux.js?v=7d575e32:46:38)\n
// 		at getSnapshotWithSelector (http://localhost:8000/node_modules/.vite/deps/react-redux.js?v=7d575e32:74:22)\n
// 			at mountSyncExternalStore (http://localhost:8000/node_modules/.vite/deps/chunk-3ZBFE22O.js?v=7d575e32:11427:28)\n
// 			at Object.useSyncExternalStore (http://localhost:8000/node_modules/.vite/deps/chunk-3ZBFE22O.js?v=7d575e32:12114:22)\n
// 			at useSyncExternalStore (http://localhost:8000/node_modules/.vite/deps/chunk-XO35FAC6.js?v=7d575e32:1120:29)\n
// 			at useSyncExternalStoreWithSelector3 (http://localhost:8000/node_modules/.vite/deps/react-redux.js?v=7d575e32:81:23)\n
// 			at useSelector2 (http://localhost:8000/node_modules/.vite/deps/react-redux.js?v=7d575e32:243:27)\n
// 			at useTrackedSelector (http://localhost:8000/node_modules/.vite/deps/react-tracked.js?v=7d575e32:432:19)\n
// 			at useCustomTrackedSelector (http://localhost:8000/src/store/store.js?t=1722856268004:153:17)`
// }