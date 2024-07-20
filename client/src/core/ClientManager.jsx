import React from "react";
import { useState, useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { useHotkeys } from "react-hotkeys-hook";
import {
	getAppCollection,
	getPage,
	getPageCount,
	getPageContent,
	getPageSize,
	getInReverse,
	getFilterModel,
	getActiveFilter,
	getFilteredList,
	getSelectedApp,
	getSelectedAppKey,
	getEditMode,
	getCurrentIndex,
	getPreviousKey,
	getNextKey,
	selectPageContent,
	memoizedSelectAppByKey,
} from "store/selectors";
import { rootStore } from "store/store";
import {
	getAllApps,
	fetchApp,
	deleteApp,
	updateApp,
	addApp,
	rawApi,
} from "api/appCollectionApi";

const queryClient = new QueryClient();

export const useClientManager = () => {
	const { store } = rootStore;
	const state = store.getState();
	const { page, selectedAppKey, editMode, pageCount, getTotalSize } = state;
	const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE) || 20;
	const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";

	useEffect(() => {
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
		console.log("ClientManager hook: Page changed - fetching new content");
		const newPage = getPageContent();
		const oldPage = rootStore.get.pageContent();
		// Array.isArray(newPage) && console.log(newPage[0]?.key);
		// Array.isArray(oldPage) && console.log(oldPage[0]?.key);

		DEBUG &&
			console.log(`ClientManager hook:
			Page: ${page},
			Total: ${getTotalSize(rootStore.store.getState())},
			Count: ${pageCount}`);

		rootStore.set.page(page);
		rootStore.set.isLoading(false);
	}, [rootStore.use.page()]);

	const seedStore = async () => {
		getAllApps().then((apps) => {
			console.log(
				`ClientManager: Seeding app collection: Got ${apps.length} apps`,
			);
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
		const app = fetchApp(key).then((app) => {
			rootStore.set.isLoading(false);
			rootStore.set.selectedApp(app);
			console.log(
				`ClientManager: Set app object in store: ${rootStore.get.selectedApp()?.key}`,
			);
		});
	};

	const openFirstPage = () => {
		const apps = selectPageContent(state);
		rootStore.set.pageContent(apps);
		return apps;
	};

	const gotoPage = (page) => {
		console.log(`ClientManager: Goto page: ${page}`);
		const apps = selectPageContent(state);
		rootStore.set.page(page);
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

	const selectPrevApp = () => {
		const prevKey = getPreviousKey(state);
		const prevApp = memoizedSelectAppByKey(state, prevKey);
		rootStore.set.selectedApp(prevApp);
		rootStore.set.selectedAppKey(prevKey);
		console.log("Prev appKey: ", prevKey);
		console.log("Prev app: ", prevApp);
	};

	const selectNextApp = () => {
		const nextKey = getNextKey(state);
		const nextApp = memoizedSelectAppByKey(state, nextKey);
		rootStore.set.selectedApp(nextApp);
		rootStore.set.selectedAppKey(nextKey);
		console.log("Next appKey: ", nextKey);
		console.log("Next app: ", nextApp);
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
		rootStore.set.isLoading(true);
		deleteApp(appKey).then(() => {
			rootStore.set.appCollection((prev) =>
				prev.filter((app) => app.key !== appKey),
			);
			rootStore.set.pageContent((prev) => {
				return prev.filter((app) => app.key !== appKey);
			});
			rootStore.set.isLoading(false);
			invalidateCache();
			console.log("ClientManager: App deleted");
		});
	};

	const editItem = (appKey) => {
		console.log(`ClientManager: Editing app with key: ${appKey}`);
		if (appKey) {
			const app = memoizedSelectAppByKey(state, appKey);
			rootStore.set.selectedApp(app);
			rootStore.set.selectedAppKey(appKey);
		}
		rootStore.set.editMode(true);
		console.log(`ClientManager: Edit flag set: ${editMode}`);
	};

	const updateItem = (app) => {
		setIsLoading(true);
		app.edited = true;
		updateApp(app.appKey).then(() => {
			rootStore.set.appCollection(...prev, app);
			setIsLoading(false);
			invalidateCache();
		});
	};

	const addItem = () => {
		console.log("Adding new item");
		rootStore.set.selectedApp(null);
		rootStore.set.selectedAppKey(null);
		rootStore.setEditMode(true);
		console.log(`ClientManager: Edit flag set: ${editMode}`);
		console.log(
			`ClientManager: Emptied app selection: ${selectedAppKey === null}`,
		);
	};

	const saveNewItem = (app) => {
		setIsLoading(true);
		addApp(app).then(() => {
			rootStore.set.appCollection(...prev, app);
			// if (page === pageCount.length) {
			// 	setPageContent([...pageContent, app]);
			// }
			setIsLoading(false);
			invalidateCache();
		});
	};

	const invalidateCache = () => {
		queryClient.invalidateQueries(["appCollection", "apps"]);
	};
	/*
export const selectPageContent = async (state) => {
  console.log('SELECTOR: selectPageContent');
  const { appCollection, page, inReverse, selectedAppKey } = state;
  const skip = page < 2 ? 0 : (page - 1) * PAGE_SIZE;
  const cutoff = skip + Number.parseInt(PAGE_SIZE, 10);
  console.log('Slicing: ', skip, page, cutoff);
  const slice = appCollection?.slice(skip, cutoff) || [];

  rootStore.set.selectedAppKey(inReverse ? slice[slice.length - 1]?.key : slice[0]?.key);
  rootStore.set.pageContent(slice);
  return slice;
};

export const getCurrentIndex = (state) => {
  const { appCollection, selectedAppKey } = state;
  return findIndex(selectedAppKey, appCollection);
};
  */

	// const getPageContent = (page) => {
	// 	setPage(page);
	// 	selectPageContent(getAppCollection, page);
	// };
	// const selectPrev = () => {
	//   setSelectedAppKey(getPreviousKey(appCollectionStore));
	// };
	// const selectNext = () => {
	//   setSelectedAppKey(getNextKey(appCollectionStore));
	// };

	// const setFilter = (filter) => {
	//   setActiveFilter(filter);
	//   setFilteredList(getFilteredList(filterModel, filter));
	// };
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
		addItem,
		editItem,
		gotoPage,
		gotoPrevPage,
		gotoNextPage,
	};
};
