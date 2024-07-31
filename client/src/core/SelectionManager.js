import { fetchApp, getTagsByAppId } from "api/appCollectionApi";
import { toast } from "sonner";
import { getNextKey, getPreviousKey, selectAppByKey, getSearchBase } from "store/selectors";
import { rootStore } from "store/store";
import { transformNullValues } from "api/helpers";
import { usePageManager } from "./PageManager";

export const useSelectionManager = () => {
	const { store } = rootStore;
	const state = store.getState();
	const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";
	const { gotoNextPage, gotoPrevPage } = usePageManager();

	const setSelectedAppKey = (key) => {
		DEBUG && console.log("Selected app key: ", key);
		rootStore.set.selectedAppKey(key);
		rootStore.set.isLoading(true);
		if (key === null) return;
		const app = fetchApp(key)
			.then((app) => {
				rootStore.set.isLoading(false);
				rootStore.set.selectedApp(app);

				getAppTags(app.id)
					.then((tags) => {
						rootStore.set.selectedAppTags(tags);
					})
					.catch((err) => {
						console.error(err);
						toast.error("Error fetching tags");
					});

				DEBUG &&
					console.log(
						`SelectionManager: Set app object in store:
					- Key: ${rootStore.get.selectedApp()?.key}
					- Tags: ${rootStore.set.selectedAppTags()}`,
					);
			})
			.catch((err) => {
				toast.error("Error fetching app: ", err);
			});
	};

	const setSelectedGroupKey = (key) => {
		true && console.log("Selected group key: ", key);
		rootStore.set.selectedGroupKey(rootStore.get.appGroupKeys()[key - 1]);
		rootStore.set.selectedGroup(rootStore.get.appGroups()[key]);
		rootStore.set.selectedGroupId(rootStore.get.appGroups()[key].id);
		console.log("Set selected group: ", rootStore.get.selectedGroup());
	};

	const _isFirstOnPage = (appKey) => {
		const pageContent = rootStore.get.pageContent();
		return appKey === pageContent[0]?.key;
	};

	const _isLastOnPage = (appKey) => {
		const pageContent = rootStore.get.pageContent();
		return appKey === pageContent[pageContent?.length - 1]?.key;
	};

	const selectPrevApp = () => {
		const currentKey = rootStore.get.selectedAppKey();
		const prevKey = getPreviousKey(state);
		const prevApp = selectAppByKey(prevKey);
		rootStore.set.selectedApp(prevApp);
		rootStore.set.selectedAppKey(prevKey);
		if (_isFirstOnPage(currentKey)) {
			rootStore.set.inReverse(true);
			gotoPrevPage();
		}
	};

	const selectNextApp = () => {
		const currentKey = rootStore.get.selectedAppKey();
		const nextKey = getNextKey(state);
		const nextApp = selectAppByKey(nextKey);
		rootStore.set.selectedApp(nextApp);
		rootStore.set.selectedAppKey(nextKey);
		rootStore.set.inReverse(false);
		_isLastOnPage(currentKey) && gotoNextPage();
	};

	const editItem = (appKey) => {
		DEBUG && console.log(`SelectionManager: Editing app with key: ${appKey}`);
		if (appKey) {
			const app = selectAppByKey(appKey);
			rootStore.set.selectedApp(transformNullValues({ ...app }));
			rootStore.set.selectedAppKey(appKey);
			rootStore.set.isNewApp(false);
		}
		rootStore.set.editMode(true);
		DEBUG &&
			console.log(`SelectionManager:
			- Edit flag set: ${rootStore.get.editMode()}
			- isNewApp flag set: ${rootStore.get.isNewApp()}`);
	};

	const getAppTags = async (appId) => {
		const tags = await getTagsByAppId(appId);
		DEBUG && console.log("SelectionManager got tags for app: ", tags);
		return tags;
	};

	const addItem = () => {
		DEBUG && console.log("Adding new item");
		rootStore.set.selectedApp(null);
		rootStore.set.selectedAppKey(null);
		rootStore.set.isNewApp(true);
		rootStore.set.editMode(true);
		DEBUG &&
			console.log(`SelectionManager:
				- Edit flag set: ${rootStore.get.editMode()}
				- isNewApp flag set: ${rootStore.get.isNewApp() === null}
				- Emptied app selection: ${rootStore.get.selectedAppKey() === null}`);
	};

	const clearAppSelection = () => {
		rootStore.set.selectedApp(null);
		rootStore.set.selectedAppKey(null);
	};

	return {
		setSelectedAppKey,
		selectPrevApp,
		selectNextApp,
		editItem,
		getAppTags,
		addItem,
		clearAppSelection,
		getSearchBase,
		setSelectedGroupKey
	};
};
