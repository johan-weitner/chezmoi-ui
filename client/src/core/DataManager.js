import {
	addAppTags,
	deleteApp,
	getAllApps,
	getAllTags,
	saveNewApp,
	updateApp,
	markAppDone,
	updateTagWhiteList
} from "api/appCollectionApi";
import { useEffect } from "react";
import { toast } from "sonner";
import { selectPageContent } from "store/selectors";
import {
	rootStore,
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
import { useSelectionManager } from "./SelectionManager";
import { log } from 'utils/logger';

export const useDataManager = () => {
	const { dispatch } = store;
	const { page, pageCount } = getState();
	const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE) || 20;
	const { gotoPage, getPageContent } = usePageManager();
	const { seedGroups } = useGroupManager();
	const { setSelectedAppKey } = useSelectionManager();

	const useBootstrap = () => {
		return useEffect(() => {
			const appCollection = getState().appCollection;
			if (
				appCollection &&
				appCollection.length > 0
			) {
				log.warn("Found no apps");
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

	const refreshAppCollection = async () => {
		getAllApps().then((apps) => {
			dispatch(setAppCollection(apps));
			dispatch(setPageCount(Math.ceil(apps.length / getState().pageSize),));
		});
	};

	const deleteItem = (appKey) => {
		const apps = getState().appCollection;
		const pageContent = getState().pageContent;
		const appId = apps.find((app) => app.key === appKey).id;
		dispatch(setIsLoading(true));

		deleteApp(appId)
			.then(() => {
				const newList = apps.filter((app) => app.key !== appKey);
				const newPage = pageContent.filter((app) => app.key !== appKey);
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

	const updateItem = (app, appTags) => {
		const appKey = app.key;
		toggleLoading(true);
		tagApp(Number.parseInt(app.id, 10), appTags)
			.then((res) => {
				log.debuglog("Tagged app: ", res);
			})
			.catch((e) => {
				log.error(e);
			});
		const apps = getState().appCollection;
		updateApp(app)
			.then(() => {
				rootStore.set.appCollection([ // FIXME!!!
					...apps,
					{
						...app,
						edited: "true",
					},
				]);

				const index = apps.findIndex((item) => item.key === app.key);
				apps[index] = app;
				dispatch(setAppCollection(apps));
				gotoPage(getState().page);
				toggleLoading(false);
				toast.success("App updated successfully");
			})
			.catch((err) => {
				log.error("DataManager: Error updating app: ", err);
				toast.error("Error updating app");
			});
	};

	const saveNewItem = (app, tagIds) => {
		dispatch(setIsLoading(true));
		const apps = getState().appCollection;
		const pageContent = getState().pageContent;
		saveNewApp(app)
			.then((newApp) => {
				tagApp(newApp?.id, tagIds);
				dispatch(setAppCollection([...apps, app]));
				if (page === pageCount.length) {
					dispatch(setPageCount([...pageContent, app]));
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
			.then(() => {
				refreshAppCollection().then(res => {
					toast.success("App marked as done");
				});
				setSelectedAppKey(app.key);
			})
			.catch((err) => {
				log.error("DataManager: Error marking app as done: ", err);
				toast.error("Error marking app as done");
			});
	};

	const tagApp = async (appId, tagIds) => {
		dispatch(setIsLoading(true));
		await addAppTags(appId, tagIds)
			.then(() => {
				toggleLoading(false);
				// toast.success("Tags added");
			})
			.catch((err) => {
				toggleLoading(false);
				log.log("DataManager: Error adding tag: ", err);
				// toast.error("Error adding tag");
			});
	};

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

	const downloadYaml = () => {
		log.info("Downloading YAML...");
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
		tagApp,
		setIsLoading: toggleLoading,
		setIsEditMode,
		downloadYaml,
		flagAppDone,
		updateAllowedTags
	};
};
