import { fetchApp } from "api/appCollectionApi";
import { toast } from "sonner";
import { getNextKey, getPreviousKey, selectAppByKey, getSearchBase } from "store/selectors";
import {
	getState,
	store,
	setIsLoading,
	setSelectedApp,
	setSelectedAppKey,
	setSelectedGroupKey,
	setSelectedGroup,
	setIsNewApp,
	setInReverse,
	setEditMode
} from "store/store";
import { transformNullValues } from "api/helpers";
import { usePageManager } from "./PageManager";
import { log } from 'utils/logger';

export const useSelectionManager = () => {
	const { dispatch } = store;
	const { gotoNextPage, gotoPrevPage } = usePageManager();

	const toggleLoading = (isLoading) => {
		dispatch(setIsLoading(isLoading));
	};

	const selectAppKey = (key) => {
		dispatch(setSelectedAppKey(key));
		if (key === null) return;
		toggleLoading(true);
		const app = fetchApp(key)
			.then((app) => {
				toggleLoading(false);
				dispatch(setSelectedApp(app));
			})
			.catch((err) => {
				log.error(err);
				toast.error("Error fetching app: ", err);
			});
	};

	const selectGroup = (key) => {
		dispatch(setSelectedGroupKey(key));
		dispatch(setSelectedGroup(getState().appGroups[key]));
	};

	const _isFirstOnPage = (appKey) => {
		const pageContent = getState().pageContent;
		return appKey === pageContent[0]?.key;
	};

	const _isLastOnPage = (appKey) => {
		const pageContent = getState().pageContent;
		return appKey === pageContent[pageContent?.length - 1]?.key;
	};

	const selectPrevApp = () => {
		const currentKey = getState().selectedAppKey;
		const prevKey = getPreviousKey(getState());
		const prevApp = selectAppByKey(prevKey);
		dispatch(setSelectedApp(prevApp));
		selectAppKey(prevKey);
		if (_isFirstOnPage(currentKey)) {
			dispatch(setInReverse(true));
			gotoPrevPage();
		}
	};

	const selectNextApp = () => {
		const currentKey = getState().selectedAppKey;
		const nextKey = getNextKey(getState());
		const nextApp = selectAppByKey(nextKey);
		dispatch(setSelectedApp(nextApp));
		selectAppKey(nextKey);
		dispatch(setInReverse(false));
		_isLastOnPage(currentKey) && gotoNextPage();
	};

	const editItem = (appKey) => {
		if (appKey) {
			const app = selectAppByKey(appKey);
			dispatch(setSelectedApp(transformNullValues({ ...app })));
			selectAppKey(appKey);
			dispatch(setIsNewApp(false));
		}
		dispatch(setEditMode(true));
	};

	const addItem = () => {
		dispatch(setSelectedApp(null));
		selectAppKey(null);
		dispatch(setIsNewApp(true));
		dispatch(setEditMode(true));
	};

	const clearAppSelection = () => {
		dispatch(setSelectedApp(null));
		selectAppKey(null);
	};

	return {
		setSelectedAppKey: selectAppKey,
		selectPrevApp,
		selectNextApp,
		editItem,
		addItem,
		clearAppSelection,
		getSearchBase,
		setSelectedGroupKey: selectGroup
	};
};
