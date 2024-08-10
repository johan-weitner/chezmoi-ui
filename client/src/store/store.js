import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE, 10);
export const MAIN_VIEWS = ["apps", "groups", "tags", "settings"];

const initialState = {
	mainView: MAIN_VIEWS[0],
	appCollection: null,
	appGroups: [],
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

export const useStore = () => {
	const dispatch = useDispatch();
	const state = useSelector((state) => state.root);

	return { state, dispatch };
};

export const getState = () => {
	return store.getState().root;
};

export { useSelector };