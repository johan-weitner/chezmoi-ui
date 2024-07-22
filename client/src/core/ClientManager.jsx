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
} from "api/appCollectionApi";

export const useClientManager = () => {
	const { store } = rootStore;
	const state = store.getState();
	const { page, pageCount, getTotalSize } = state;
	const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE) || 20;
	const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";

	useEffect(() => {
		if (
			rootStore.get.appCollection() &&
			rootStore.get.appCollection().length > 0
		) {
			return;
		}
		console.log("--=== ClientManager: Seeding client... ===--");
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
			rootStore.set.isLoading(false);
			console.log("--=== ClientManager: Done seeding client! ===--");
		});
	}, []);

	useEffect(() => {
		if (!rootStore.get.appCollection()) {
			return;
		}
		rootStore.set.isLoading(true);
		const newPage = getPageContent();
		rootStore.set.pageContent(newPage);

		rootStore.set.isLoading(false);
	}, [rootStore.use.page()]);

	const seedStore = async () => {
		getAllApps().then((apps) => {
			console
				.log(`ClientManager: Seeding app collection: Got ${apps.length} apps`)
				.catch((err) => {
					toast.error("Error fetching app collection: ", err);
				});
			const totalCount = apps?.length || 0;
			const pageCount = Math.ceil(apps.length / PAGE_SIZE);

			DEBUG &&
				console.log(`ClientManager:
			totalCount: ${totalCount},
			pageCount: ${pageCount},
			PAGE_SIZE: ${PAGE_SIZE}`);

			rootStore.set.appCollection(apps);
			rootStore.set.totalCount(totalCount);
			rootStore.set.pageCount(pageCount);
			rootStore.set.page(1);

			DEBUG &&
				console.log(`ClientManager: Populated global state:
				appCollection: ${rootStore.get.appCollection()?.length}
				totalCount: ${rootStore.get.totalCount()}
				pageCount: ${rootStore.get.pageCount()}
				page: ${rootStore.get.page()}`);

			return openFirstPage();
		});
	};

	const setSelectedAppKey = (key) => {
		console.log(`ClientManager: Set selected app key: ${key}`);
		rootStore.set.selectedAppKey(key);
		console.log(
			`ClientManager: Selected app key: ${rootStore.get.selectedAppKey()}`,
		);
		rootStore.set.isLoading(true);
		const app = fetchApp(key)
			.then((app) => {
				rootStore.set.isLoading(false);
				rootStore.set.selectedApp(app);
				console.log(
					`ClientManager: Set app object in store: ${rootStore.get.selectedApp()?.key}`,
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
		console.log(`ClientManager: Goto page: ${page}`);
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
		const apps = selectPageContent(state);
		rootStore.set.pageContent(apps);
		return apps;
	};

	const deleteItem = (appKey) => {
		console.log(`ClientManager: Delete app: ${appKey}`);
		const apps = rootStore.get.appCollection();
		const pageContent = rootStore.get.pageContent();
		rootStore.set.isLoading(true);
		deleteApp(appKey)
			.then(() => {
				const newList = apps.filter((app) => app.key !== appKey);
				const newPage = pageContent.filter((app) => app.key !== appKey);
				console.log("New list: ", newList);
				console.log("New page: ", newPage);
				rootStore.set.appCollection(newList);
				rootStore.set.pageContent(newPage);
				rootStore.set.isLoading(false);
				console.log("ClientManager: App deleted");
				toast.success("App deleted successfully");
			})
			.catch((err) => {
				console.error("ClientManager: Error deleting app: ", err);
				toast.error("Error deleting app");
			});
	};

	const editItem = (appKey) => {
		console.log(`ClientManager: Editing app with key: ${appKey}`);
		if (appKey) {
			const app = selectAppByKey(appKey);
			rootStore.set.selectedApp(app);
			rootStore.set.selectedAppKey(appKey);
			rootStore.set.isNewApp(false);
		}
		rootStore.set.editMode(true);
		DEBUG &&
			console.log(`ClientManager:
			- Edit flag set: ${rootStore.get.editMode()}
			- isNewApp flag set: ${rootStore.get.isNewApp()}`);
	};

	const updateItem = (app) => {
		setIsLoading(true);
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
				toast.success("App updated successfully");
			})
			.catch((err) => {
				console.error("ClientManager: Error updating app: ", err);
				toast.error("Error updating app");
			});
	};

	const addItem = () => {
		console.log("Adding new item");
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

	const saveNewItem = (app) => {
		setIsLoading(true);
		const apps = rootStore.get.appCollection();
		const pageContent = rootStore.get.pageContent();
		saveNewApp(app)
			.then(() => {
				rootStore.set.appCollection([...apps, app]);
				if (page === pageCount.length) {
					rootStore.set.pageContent([...pageContent, app]);
				}
				setIsLoading(false);
				toast.success("App added successfully");
			})
			.catch((err) => {
				console.error("ClientManager: Error saving new app: ", err);
				toast.error("Error saving new app");
			});
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
	};
};
