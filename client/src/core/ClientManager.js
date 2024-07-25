import { useEffect } from "react";
import { toast } from "sonner";
import {
	getPreviousKey,
	getNextKey,
	selectPageContent,
	selectAppByKey,
} from "store/selectors";
import { rootStore } from "store/store";
import {
	getAllApps,
	fetchApp,
	deleteApp,
	updateApp,
	saveNewApp,
	getAllTags,
	addAppTags,
	deleteAppTag,
	getTagsByAppId
} from "api/appCollectionApi";
import { filterModel } from "api/filters";
import { transformNullValues } from "../api/helpers";

export const useClientManager = () => {
	const { store } = rootStore;
	const state = store.getState();
	const { page, pageCount, getTotalSize } = state;
	const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE) || 20;
	const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";

	const useBootstrap = () => {
		return useEffect(() => {
			if (
				rootStore.get.appCollection() &&
				rootStore.get.appCollection().length > 0
			) {
				return;
			}
			DEBUG && console.log("--=== ClientManager: Seeding client... ===--");
			rootStore.set.isLoading(true);
			seedStore().then((apps) => {
				DEBUG &&
					console.log("ClientManager: Fetched data payload: ", apps?.length);
				const list = getPageContent();
				rootStore.set.pageContent(list);

				DEBUG &&
					console.log(`ClientManager:
						Page: ${page},
						Total: ${getTotalSize(rootStore.store.getState())},
						Count: ${pageCount}`);
				DEBUG && console.log("--=== ClientManager: Done seeding client! ===--");
				rootStore.set.isLoading(false);
			});
		}, []);
	};

	const usePageSwitch = () => {
		return useEffect(() => {
			if (!rootStore.get.appCollection()) {
				return;
			}
			rootStore.set.isLoading(true);
			const newPage = getPageContent();
			rootStore.set.pageContent(newPage);

			rootStore.set.isLoading(false);
		}, [rootStore.use.page()]);
	};

	const seedStore = async () => {
		const apps = await getAllApps()
			.then((apps) => {
				const totalCount = apps?.length || 0;
				const pageCount = apps && Math.ceil(apps.length / PAGE_SIZE);
				rootStore.set.appCollection(apps);
				rootStore.set.totalCount(totalCount);
				rootStore.set.pageCount(pageCount);
				rootStore.set.page(1);

				DEBUG &&
					console.log(
						`ClientManager: Seeding app collection: Got ${apps?.length} apps`,
					);
				DEBUG &&
					console.log(`ClientManager:
						totalCount: ${totalCount},
						pageCount: ${pageCount},
						PAGE_SIZE: ${PAGE_SIZE}`);

				DEBUG &&
					console.log(`ClientManager: Populated global state:
						appCollection: ${rootStore.get.appCollection()?.length}
						totalCount: ${rootStore.get.totalCount()}
						pageCount: ${rootStore.get.pageCount()}
						page: ${rootStore.get.page()}`);
			})
			.catch((err) => {
				toast.error("Error fetching app collection: ", err);
			});

		getAllTags().then(tags => {
			rootStore.set.allowedTags(tags);
		});

		return openFirstPage();
	};

	const setSelectedAppKey = (key) => {
		console.log("Selected app key: ", key);
		rootStore.set.selectedAppKey(key);
		rootStore.set.isLoading(true);
		if (key === null) return;
		const app = fetchApp(key)
			.then((app) => {
				rootStore.set.isLoading(false);
				rootStore.set.selectedApp(app);

				getAppTags(app.id).then((tags) => {
					rootStore.set.selectedAppTags(tags);
				}).catch((err) => {
					console.error(err);
					toast.error("Error fetching tags");
				});

				true && console.log(
					`ClientManager: Set app object in store:
					- Key: ${rootStore.get.selectedApp()?.key}
					- Tags: ${rootStore.set.selectedAppTags()}`
				);
			})
			.catch((err) => {
				toast.error("Error fetching app: ", err);
			});
	};

	const openFirstPage = () => {
		const apps = selectPageContent(state);
		gotoPage(1);
		rootStore.set.selectedAppKey(apps[0]?.key);
		rootStore.set.pageContent(apps);
		return apps;
	};

	const gotoPage = (page) => {
		rootStore.set.page(page);
		const apps = selectPageContent(state);
		rootStore.set.pageContent(apps);
		return apps;
	};

	const refreshAppCollection = () => {
		getAllApps().then((apps) => {
			rootStore.set.appCollection(apps);
			rootStore.set.pageCount(
				Math.ceil(apps.length / rootStore.get.pageSize()),
			);
		});
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

	const gotoPrevPage = () => {
		const page = rootStore.get.page();
		if (page > 0) {
			rootStore.set.page(page - 1);
			getPageContent();
		}
	};
	const gotoNextPage = () => {
		const page = rootStore.get.page();
		const pageCount = rootStore.get.pageCount();
		if (page < pageCount - 1) {
			rootStore.set.page(page + 1);
			getPageContent();
		}
	};

	const getPageContent = () => {
		const apps = selectPageContent();
		rootStore.set.pageContent(apps);
		return apps;
	};

	const deleteItem = (appKey) => {
		const apps = rootStore.get.appCollection();
		const pageContent = rootStore.get.pageContent();
		rootStore.set.isLoading(true);
		deleteApp(appKey)
			.then(() => {
				const newList = apps.filter((app) => app.key !== appKey);
				const newPage = pageContent.filter((app) => app.key !== appKey);
				rootStore.set.appCollection(newList);
				rootStore.set.pageContent(newPage);
				rootStore.set.isLoading(false);
				toast.success("App deleted successfully");
			})
			.catch((err) => {
				console.error("ClientManager: Error deleting app: ", err);
				toast.error("Error deleting app");
			});
	};

	const editItem = (appKey) => {
		DEBUG && console.log(`ClientManager: Editing app with key: ${appKey}`);
		if (appKey) {
			const app = selectAppByKey(appKey);
			rootStore.set.selectedApp(transformNullValues({ ...app }));
			rootStore.set.selectedAppKey(appKey);
			rootStore.set.isNewApp(false);
		}
		rootStore.set.editMode(true);
		DEBUG &&
			console.log(`ClientManager:
			- Edit flag set: ${rootStore.get.editMode()}
			- isNewApp flag set: ${rootStore.get.isNewApp()}`);
	};

	const getAppTags = async (appId) => {
		const tags = await getTagsByAppId(appId);
		console.log('ClientManager got tags for app: ', tags);
		return tags;
	};

	const updateItem = (app, appTags) => {
		const appKey = app.key;
		DEBUG &&
			console.log(`ClientManager: Updating app:
			- Tags: ${app.tags}`);
		setIsLoading(true);
		console.log('Saving tags for app with id: ', app.id);
		tagApp(Number.parseInt(app.id, 10), appTags).then((res) => {
			console.log('Tagged app: ', res);
		}).catch(e => {
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
					console.log(`ClientManager: Updated app in store:
						- Tags: ${updatedApp.tags}`);
				}

				toast.success("App updated successfully");
			})
			.catch((err) => {
				console.error("ClientManager: Error updating app: ", err);
				toast.error("Error updating app");
			});
	};

	const addItem = () => {
		DEBUG && console.log("Adding new item");
		rootStore.set.selectedApp(null);
		rootStore.set.selectedAppKey(null);
		rootStore.set.isNewApp(true);
		rootStore.set.editMode(true);
		DEBUG &&
			console.log(`ClientManager:
				- Edit flag set: ${rootStore.get.editMode()}
				- isNewApp flag set: ${rootStore.get.isNewApp() === null}
				- Emptied app selection: ${rootStore.get.selectedAppKey() === null}`);
	};

	const saveNewItem = (app, tagIds) => {
		setIsLoading(true);
		const apps = rootStore.get.appCollection();
		const pageContent = rootStore.get.pageContent();
		saveNewApp(app)
			.then((newApp) => {
				console.log('!!! Saved new app with id: ', newApp?.id);
				tagApp(newApp?.id, tagIds);
				rootStore.set.appCollection([...apps, app]);
				if (page === pageCount.length) {
					rootStore.set.pageContent([...pageContent, app]);
				}
				setIsLoading(false);
				toast.success("App successfully added");
			})
			.catch((err) => {
				console.error("ClientManager: Error saving new app: ", err);
				toast.error("Error saving new app");
			});
	};

	const tagApp = async (appId, tagIds) => {
		console.log('<<< Tags: ', tagIds);
		rootStore.set.isLoading(true);
		await addAppTags(appId, tagIds)
			.then(() => {
				rootStore.set.isLoading(false);
				toast.success("Tags added");
			})
			.catch((err) => {
				rootStore.set.isLoading(false);
				console.log("ClientManager: Error adding tag: ", err);
				// toast.error("Error adding tag");
			});
	};

	const applyFilter = (filter) => {
		DEBUG && console.log(`ClientManager: Apply filter: ${filter}`);
		rootStore.set.activeFilter(filter);
		const filteredApps = filterModel[filter].method();
		rootStore.set.filteredList(filteredApps);
	};

	const clearFilter = () => {
		rootStore.set.activeFilter(null);
		rootStore.set.filteredList(null);
	};

	const setIsLoading = (flag) => {
		rootStore.set.isLoading(flag);
	};

	const setIsEditMode = (flag) => {
		rootStore.set.editMode(flag);
	};

	return {
		seedStore,
		openFirstPage,
		openPage: gotoPage,
		refreshAppCollection,
		selectPrevApp,
		selectNextApp,
		getPageContent,
		setSelectedAppKey,
		deleteItem,
		updateItem,
		saveNewItem,
		addItem,
		editItem,
		gotoPage,
		gotoPrevPage,
		gotoNextPage,
		setIsLoading,
		setIsEditMode,
		useBootstrap,
		usePageSwitch,
		applyFilter,
		clearFilter,
		getAppTags,
		tagApp
	};
};
