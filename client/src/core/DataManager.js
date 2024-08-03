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
	setSelectedAppKey,
	setEditMode
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
				setIsLoading(false);
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
			setIsLoading(false);
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
				setIsLoading(false);
				toast.success("App deleted successfully");
			})
			.catch((err) => {
				console.error("DataManager: Error deleting app: ", err);
				toast.error("Error deleting app");
			});
	};

	const updateItem = (app, appTags) => {
		const appKey = app.key;
		setIsLoading(true);
		tagApp(Number.parseInt(app.id, 10), appTags)
			.then((res) => {
				// DEBUG && console.log("Tagged app: ", res);
			})
			.catch((e) => {
				console.error(e);
			});
		const apps = useSelector((state) => state.root.appCollection);
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
				dispatch(setAppCollection(apps));
				gotoPage(rootStore.get.page());
				setIsLoading(false);
				toast.success("App updated successfully");
			})
			.catch((err) => {
				console.error("DataManager: Error updating app: ", err);
				toast.error("Error updating app");
			});
	};

	const saveNewItem = (app, tagIds) => {
		dispatch(setIsLoading(true));
		const apps = useSelector((state) => state.root.appCollection);
		const pageContent = useSelector((state) => state.root.pageContent);
		saveNewApp(app)
			.then((newApp) => {
				tagApp(newApp?.id, tagIds);
				dispatch(setAppCollection([...apps, app]));
				if (page === pageCount.length) {
					dispatch(setPageCount([...pageContent, app]));
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
		dispatch(setIsLoading(true));
		await addAppTags(appId, tagIds)
			.then(() => {
				setIsLoading(false);
				// toast.success("Tags added");
			})
			.catch((err) => {
				setIsLoading(false);
				console.log("DataManager: Error adding tag: ", err);
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
			console.log("DataManager: Error updating tag list: ", err);
			toast.error("Error adding tag");
		});
	};

	const downloadYaml = () => {
		console.log("Downloading YAML...");
	};

	const setIsLoading = (flag) => {
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
		setIsLoading,
		setIsEditMode,
		downloadYaml,
		flagAppDone,
		updateAllowedTags
	};
};
