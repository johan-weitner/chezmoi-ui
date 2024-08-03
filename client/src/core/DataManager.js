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
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { selectAppByKey, selectPageContent } from "store/selectors";
import {
	rootStore,
	setIsLoading,
	setAppCollection,
	setPageContent,
	setTotalCount,
	setPageCount,
	setPage,
	setAllowedTags,
	setSelectedAppKey
} from "store/store";
import { usePageManager } from "./PageManager";
import { useGroupManager } from "./GroupManager";

export const useDataManager = () => {
	const dispatch = useDispatch();
	const { store } = rootStore;
	const state = store.getState();
	const { page, pageCount, getTotalSize } = state;
	const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE) || 20;
	const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";
	const { gotoPage, getPageContent } = usePageManager();
	const { seedGroups } = useGroupManager();

	const useBootstrap = () => {
		return useEffect(() => {
			const appCollection = useSelector((state) => state.root.appCollection);
			if (
				appCollection() &&
				appCollection().length > 0
			) {
				// console.warn("Found no apps");
				return;
			}
			dispatch(setIsLoading(true));
			seedStore().then((apps) => {
				setPageContent(getPageContent());
				dispatch(setIsLoading(false));
			});
			seedGroups();
		}, []);
	};

	const usePageSwitch = () => {
		return useEffect(() => {
			const appCollection = useSelector((state) => state.root.appCollection);
			if (!appCollection()) {
				return;
			}
			dispatch(setIsLoading(true));
			setPageContent(getPageContent());
			dispatch(setIsLoading(false));
		}, [rootStore.use.page()]);
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
		const apps = selectPageContent(state);
		gotoPage(1);
		dispatch(setSelectedAppKey(apps[0]?.key));
		dispatch / setPageContent(apps);
		return apps;
	};

	const refreshAppCollection = async () => {
		getAllApps().then((apps) => {
			dispatch(setAppCollection(apps));
			dispatch(setPageCount(Math.ceil(apps.length / rootStore.get.pageSize()),));
		});
	};

	const deleteItem = (appKey) => {
		const apps = useSelector((state) => state.root.appCollection);
		const pageContent = useSelector((state) => state.root.pageContent);
		dispatch(setIsLoading(true));

		deleteApp(appKey)
			.then(() => {
				const newList = apps.filter((app) => app.key !== appKey);
				const newPage = pageContent.filter((app) => app.key !== appKey);
				dispatch(setAppCollection(newList));
				dispatch(setPageContent(newPage));
				dispatch(setIsLoading(false));
				toast.success("App deleted successfully");
			})
			.catch((err) => {
				console.error("DataManager: Error deleting app: ", err);
				toast.error("Error deleting app");
			});
	};

	const updateItem = (app, appTags) => {
		const appKey = app.key;
		DEBUG &&
			console.log(`DataManager: Updating app:
			- Tags: ${app.tags}`);
		DEBUG && console.log("Saving tags for app with id: ", app.id);
		setIsLoading(true);
		tagApp(Number.parseInt(app.id, 10), appTags)
			.then((res) => {
				DEBUG && console.log("Tagged app: ", res);
			})
			.catch((e) => {
				console.error(e);
			});
		const apps = rootStore.get.appCollection();
		updateApp(app)
			.then(() => {
				rootStore.set.appCollection([
					...apps,
					{
						...app,
						edited: "true",
					},
				]);

				const index = apps.findIndex((item) => item.key === app.key);
				apps[index] = app;
				rootStore.set.appCollection(apps);
				gotoPage(rootStore.get.page());
				setIsLoading(false);

				if (DEBUG) {
					const updatedApp = selectAppByKey(appKey);
					console.log(`DataManager: Updated app in store:
						- Tags: ${updatedApp.tags}`);
				}

				toast.success("App updated successfully");
			})
			.catch((err) => {
				console.error("DataManager: Error updating app: ", err);
				toast.error("Error updating app");
			});
	};

	const saveNewItem = (app, tagIds) => {
		setIsLoading(true);
		const apps = rootStore.get.appCollection();
		const pageContent = rootStore.get.pageContent();
		saveNewApp(app)
			.then((newApp) => {
				DEBUG && console.log("!!! Saved new app with id: ", newApp?.id);
				tagApp(newApp?.id, tagIds);
				rootStore.set.appCollection([...apps, app]);
				if (page === pageCount.length) {
					rootStore.set.pageContent([...pageContent, app]);
				}
				setIsLoading(false);
				toast.success("App successfully added");
			})
			.catch((err) => {
				console.error("DataManager: Error saving new app: ", err);
				toast.error("Error saving new app");
			});
	};

	const flagAppDone = async (app, flag = true) => {
		markAppDone(app, flag)
			.then(() => {
				refreshAppCollection().then(res => {
					toast.success("App marked as done");
				});

			})
			.catch((err) => {
				console.error("DataManager: Error marking app as done: ", err);
				toast.error("Error marking app as done");
			});
	};

	const tagApp = async (appId, tagIds) => {
		DEBUG && console.log("<<< Tags: ", tagIds);
		rootStore.set.isLoading(true);
		await addAppTags(appId, tagIds)
			.then(() => {
				rootStore.set.isLoading(false);
				// toast.success("Tags added");
			})
			.catch((err) => {
				rootStore.set.isLoading(false);
				console.log("DataManager: Error adding tag: ", err);
				// toast.error("Error adding tag");
			});
	};

	const updateAllowedTags = async (tags) => {
		rootStore.set.isLoading(false);
		console.log("DataManager: Updating allowed tags: ", tags);
		updateTagWhiteList(tags).then((newTags) => {
			rootStore.set.allowedTags(newTags);
			return newTags;
		}).catch((err) => {
			rootStore.set.isLoading(false);
			console.log("DataManager: Error updating tag list: ", err);
			toast.error("Error adding tag");
		});
	};

	const downloadYaml = () => {
		console.log("Downloading YAML...");
	};

	const setIsLoading = (flag) => {
		rootStore.set.isLoading(flag);
	};

	const setIsEditMode = (flag) => {
		rootStore.set.editMode(flag);
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
		setIsLoading,
		setIsEditMode,
		downloadYaml,
		flagAppDone,
		updateAllowedTags
	};
};
