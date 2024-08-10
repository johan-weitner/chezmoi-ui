import {
	addAppTags,
	deleteApp,
	getAllApps,
	fetchUnfinishedApps,
	getAllTags,
	saveNewApp,
	updateApp,
	markAppDone,
	updateTagWhiteList
} from "api/fetchApi";
import { useEffect } from "react";
import { toast } from "sonner";
import { selectPageContent } from "store/selectors";
import {
	getState,
	store,
	setIsLoading,
	setAppCollection,
	setPageContent,
	setTotalCount,
	setPageCount,
	setPage,
	setAllowedTags,
	setSelectedAppKey,
	setEditMode
} from "store/store";
import { usePageManager } from "./PageManager";
import { useGroupManager } from "./GroupManager";
import { log } from 'utils/logger';
import { mapEntityToDb } from "api/helpers";
import { setSelectedApp } from "../store/store";

export const useDataManager = () => {
	const { dispatch } = store;
	const { page, pageCount } = getState();
	const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE) || 20;
	const { gotoPage, getPageContent } = usePageManager();
	const { seedGroups } = useGroupManager();
	// const { setSelectedAppKey } = useSelectionManager();

	const useBootstrap = () => {
		return useEffect(() => {
			const appCollection = getState().appCollection;
			if (
				appCollection &&
				appCollection.length > 0
			) {
				return;
			}
			dispatch(setIsLoading(true));
			seedStore().then((apps) => {
				setPageContent(getPageContent());
				toggleLoading(false);
			});
			seedGroups();
		}, []);
	};

	const usePageSwitch = () => {
		return useEffect(() => {
			const appCollection = getState().appCollection;
			if (!appCollection()) {
				return;
			}
			dispatch(setIsLoading(true));
			setPageContent(getPageContent());
			toggleLoading(false);
		}, [getState().page]);
	};

	const seedStore = async () => {
		const apps = await getAllApps()
			.then((apps) => {
				const totalCount = apps?.length || 0;
				const pageCount = apps && Math.ceil(apps.length / PAGE_SIZE);
				dispatch(setAppCollection(apps));
				dispatch(setTotalCount(totalCount));
				dispatch(setPageCount(pageCount));
				dispatch(setPage(1));
			})
			.catch((err) => {
				toast.error("Error fetching app collection: ", err);
			});

		getAllTags().then((tags) => {
			dispatch(setAllowedTags(tags));
		});

		seedGroups();

		return openFirstPage();
	};

	const openFirstPage = () => {
		const apps = selectPageContent(getState());
		gotoPage(1);
		dispatch(setSelectedAppKey(apps[0]?.key));
		dispatch(setPageContent(apps));
		return apps;
	};

	const refreshAppCollection = async (filterOutFinishedApps = false) => {
		if (filterOutFinishedApps) {
			fetchUnfinishedApps().then((apps) => {
				dispatch(setAppCollection(apps));
				dispatch(setPageCount(Math.ceil(apps.length / getState().pageSize),));
			});
		} else {
			getAllApps().then((apps) => {
				dispatch(setAppCollection(apps));
				dispatch(setPageCount(Math.ceil(apps.length / getState().pageSize),));
			});
		}

	};

	const deleteItem = (appId) => {
		const apps = getState().appCollection;
		const pageContent = getState().pageContent;
		log.debug("DataManager: Deleting app with it: ", appId);

		deleteApp(appId)
			.then(() => {
				const newList = apps.filter((app) => app.id !== appId);
				const newPage = pageContent.filter((app) => app.id !== appId);
				dispatch(setAppCollection(newList));
				dispatch(setPageContent(newPage));
				toggleLoading(false);
				toast.success("App deleted successfully");
			})
			.catch((err) => {
				log.error("DataManager: Error deleting app: ", err);
				toast.error("Error deleting app");
			});
	};

	const updateItem = (app, appTags, appGroups) => {
		const appEntity = mapEntityToDb(app);
		log.debug("DataManager: updateItem: ", appEntity, appTags, appGroups);
		toggleLoading(true);
		const apps = getState().appCollection;
		updateApp(appEntity, appTags, appGroups)
			.then((updatedApp) => {
				dispatch(setSelectedApp({ ...updatedApp }));
				toggleLoading(false);
				toast.success("App updated successfully");
			})
			.catch((err) => {
				log.error("DataManager: Error updating app: ", err.response.data.error);
				toast.error("Error updating app");
			});
	};

	const updateAppInCollection = app => {
		const apps = getState().appCollection;
		const index = apps.findIndex((item) => item.key === app.key);
		log.debug(`DataManager: updateAppInCollection: ${app.key} at index ${index}`);
		insertSlimmedAppAt(app, index);
		gotoPage(getState().page);
	};

	const insertSlimmedAppAt = (app, index) => {
		log.debug(`DataManager: insertSlimmedAppAt: ${app.key} at index ${index}`);
		// return;
		const apps = [...getState().appCollection];
		apps[index] = {
			id: app.id,
			key: app.key,
			name: app.name,
			done: app.done || false,
			edited: true,
		};
		log.debug(apps[index]);
		dispatch(setAppCollection([...apps]));
	};

	const saveNewItem = (app, tagIds, groups) => {
		dispatch(setIsLoading(true));
		const apps = getState().appCollection;
		const pageContent = getState().pageContent;
		saveNewApp({
			...app,
			appTags: tagIds || [],
			ApplicationGroup: groups || [],
			edited: true,
		})
			.then((newApp) => {
				updateAppInCollection(app);
				if (page === pageCount.length) {
					dispatch(setPageContent([...pageContent, app]));
				}
				toggleLoading(false);
				toast.success("App successfully added");
			})
			.catch((err) => {
				log.error("DataManager: Error saving new app: ", err);
				toast.error("Error saving new app");
			});
	};

	const flagAppDone = async (app, flag = true) => {
		markAppDone(app, flag)
			.then((updatedApp) => {
				updateAppInCollection({ ...app, done: flag });
			})
			.catch((err) => {
				log.error("DataManager: Error marking app as done: ", err.response.data.error);
				toast.error("Error marking app as done");
			});
	};

	// const tagApp = async (appId, tagIds) => {
	// 	dispatch(setIsLoading(true));
	// 	await addAppTags(appId, tagIds)
	// 		.then(() => {
	// 			toggleLoading(false);
	// 			// toast.success("Tags added");
	// 		})
	// 		.catch((err) => {
	// 			toggleLoading(false);
	// 			log.log("DataManager: Error adding tag: ", err);
	// 			// toast.error("Error adding tag");
	// 		});
	// };

	const updateAllowedTags = async (tags) => {
		dispatch(setIsLoading(true));
		updateTagWhiteList(tags).then((newTags) => {
			dispatch(setAllowedTags(newTags));
			return newTags;
		}).catch((err) => {
			dispatch(setIsLoading(false));
			log.log("DataManager: Error updating tag list: ", err);
			toast.error("Error adding tag");
		});
	};

	const toggleLoading = (flag) => {
		dispatch(setIsLoading(flag));
	};

	const setIsEditMode = (flag) => {
		dispatch(setEditMode(flag));
	};

	return {
		useBootstrap,
		usePageSwitch,
		seedStore,
		openFirstPage,
		refreshAppCollection,
		updateItem,
		deleteItem,
		saveNewItem,
		// tagApp,
		setIsLoading: toggleLoading,
		setIsEditMode,
		flagAppDone,
		updateAllowedTags
	};
};
