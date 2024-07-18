import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient, QueryClient } from "@tanstack/react-query";
import { useStore } from "store/rootState";
import { useHotkeys } from "react-hotkeys-hook";
import {
	getAllApps,
	getAppPage,
	getApp,
	updateApp,
	addApp,
	deleteApp,
} from "api/appCollectionApi.js";
import { appModelInstallerFields } from "api/appModel";
import { filterModel } from "api/filters";

const _findIndex = (key, list) => {
	return list.findIndex((item) => item.key === key);
};

const useClientManager = () => {
	// const [allApps, setAllApps] = useState([]);
	// const [totalCount, setTotalCount] = useState(0);
	// const [selectedApp, setSelectedApp] = useState(null);
	// const [selectedAppKey, setSelectedAppKey] = useState(null);
	// const [page, setPage] = useState(1);
	// const [pageContent, setPageContent] = useState([]);
	// const [limit, setLimit] = useState(20);
	// const [pageCount, setPageCount] = useState(0);
	// const [activeFilter, setActiveFilter] = useState(null);
	// const [editMode, setEditMode] = useState(null);
	const [inReverse, setInReverse] = useState(false);
	// const [isLoading, setIsLoading] = useState(null);
	// const [error, setError] = useState(null);
	const {
		allApps,
		setAllApps,
		totalCount,
		setTotalCount,
		limit,
		setLimit,
		downloadGenericYaml,
		downloadGenericJson,
		downloadInstallDoctorYaml,
		selectedApp,
		setSelectedApp,
		selectedAppKey,
		setSelectedAppKey,
		// selectApp,
		closeApp,
		editItem,
		addItem,
		isEditMode: editMode,
		setIsEditeMode: setEditMode,
		page,
		pageCount,
		pageContent,
		setPage,
		setPageCount,
		setPageContent,
		filterModel,
		filteredResult,
		activeFilter,
		isLoading,
		setIsLoading,
		error,
		setError,
	} = useStore();

	const queryClient = useQueryClient();
	// const queryClient = new QueryClient();
	const _setListSize = (size) => setTotalCount(size);
	const _setNumPages = (size) => setPageCount(Math.ceil(size / limit));

	const _isNullOrEmpty = (value) => {
		return value === null || value === undefined || value === "";
	};

	const _appHasInstaller = (app) => {
		for (const field of appModelInstallerFields) {
			if (app && !_isNullOrEmpty(app[field])) {
				return true;
			}
		}
		return false;
	};

	const _isStartOfPage = (index) => {
		return index === 0;
	};

	const _isEndOfPage = (index) => {
		return index === pageContent.length - 1;
	};

	const getPage = (page) => {
		//console.log(`Getting page: ${page}`);
		setIsLoading(true);
		getAppPage(page).then((apps) => {
			//console.log("Got page", apps);
			setPage(page);
			setPageContent(apps);
			setIsLoading(false);
			// invalidateCache();
			// queryClient.setQueryData(["appPage"], apps);
		});
	};

	const selectApp = (appKey) => {
		if (!appKey) {
			console.warn("Tried to select an app with no key");
			return;
		}
		setIsLoading(true);
		const app = getApp(appKey).then((app) => {
			if (!app) {
				console.warn("Found no app with key: ", appKey);
				setIsLoading(false);
				return;
			}
			app.hasInstaller = _appHasInstaller(app);
			setSelectedApp(app);
			setSelectedAppKey(appKey);
			setIsLoading(false);
		});
	};

	const clearAppSelection = () => {
		setSelectedApp(null);
		setSelectedAppKey(null);
	};

	// const editItem = (appKey) => {
	// 	//console.log("Edit");
	// 	if (appKey) {
	// 		//console.log("Getting app...");
	// 		setIsLoading(true);
	// 		getApp(appKey).then((app) => {
	// 			selectApp(appKey);
	// 			setEditMode(true);
	// 			setIsLoading(false);
	// 		});
	// 	} else {
	// 		//console.log("Set edit mode");
	// 		setEditMode(true);
	// 	}
	// };

	const deleteItem = (appKey) => {
		setIsLoading(true);
		deleteApp(appKey).then(() => {
			setAllApps(allApps.filter((app) => app.key !== appKey));
			setPageContent(pageContent.filter((app) => app.key !== appKey));
			setIsLoading(false);
			invalidateCache();
		});
	};

	const updateItem = (app) => {
		setIsLoading(true);
		app.edited = true;
		updateApp(app.appKey).then(() => {
			setAllApps(...prev, app);
			setIsLoading(false);
			invalidateCache();
		});
	};

	const editNewItem = () => {
		//console.log("Edit new item");
		clearAppSelection();
		setEditMode(true);
	};

	// const addItem = (app) => {
	// 	setIsLoading(true);
	// 	addApp(app).then(() => {
	// 		setAllApps([...prev, app]);
	// 		if (page === pageCount.length) {
	// 			setPageContent([...pageContent, app]);
	// 		}
	// 		setIsLoading(false);
	// 		invalidateCache();
	// 	});
	// };

	const gotoPrev = () => {
		if (selectedAppKey && pageContent) {
			const index = _findIndex(selectedAppKey, pageContent);
			_isStartOfPage(index)
				? gotoPrevPage()
				: selectApp(pageContent[index - 1].key);
		} else {
			Array.isArray(pageContent) && selectApp(pageContent[0].key);
		}
	};

	const gotoNext = () => {
		if (selectedAppKey && pageContent) {
			const index = _findIndex(selectedAppKey, pageContent);
			_isEndOfPage(index)
				? gotoNextPage()
				: selectApp(pageContent[index + 1].key);
		} else {
			Array.isArray(pageContent) && selectApp(pageContent[0]?.key);
		}
	};

	const gotoPrevPage = () => {
		setInReverse(true);
		page > 1 && getPage(page - 1);
	};

	const gotoNextPage = () => {
		//console.log(`Turning page from ${page} to ${page + 1}`);
		//console.log(`PageCount ${pageCount}`);
		page < pageCount && getPage(page + 1);
	};

	const applyFilter = async (filter) => {
		setIsLoading(true);
		setActiveFilter(filter);
		const filteredeApps = getAllApps().then((apps) => {
			const filteredApps = filterModel[filter].method(apps);
			setAllApps(filteredApps);
			initPagination();
			setIsLoading(false);
			return filterModel[filter].method(apps);
		});
		invalidateCache();
		queryClient.setQueryData(["appPage"], filteredeApps);
		return filteredeApps;
	};

	const restoreFilters = async (filter) => {
		setActiveFilter(null);
		setIsLoading(true);
		const appList = getAllApps().then((apps) => {
			setAllApps(apps);
			initPagination();
			setIsLoading(false);
			return apps;
		});
		invalidateCache();
		queryClient.setQueryData(["appPage"], appList);
		return appList;
	};

	const invalidateCache = () => {
		queryClient.invalidateQueries(["appCollection", "appPage"]);
		// queryClient.setQueryData(["appCollection"], filteredeApps);
	};

	const populateList = (page = 1) => {
		//console.log(`*** Populating list - viewing page ${page} ***`);
		setIsLoading(true);
		getAllApps().then((apps) => {
			setAllApps(apps);
			_setListSize(apps?.length);
			_setNumPages(apps?.length);
			setPage(page);
			getAppPage(page).then((apps) => {
				//console.log("PopulateList: ", apps?.length);
				setPageContent(apps);
				selectApp(apps[0].key);
				setIsLoading(false);
				invalidateCache();
			});
		});
	};

	const initPagination = (page = 1) => {
		console.debug("Initializing pagination...");
		_setListSize(allApps?.length);
		_setNumPages(Math.ceil(allApps?.length / 20));
		setPage(page);
		// console.table({
		// 	page,
		// 	totalCount,
		// 	pageCount,
		// 	totalCount,
		// });
		if (allApps.length > 0) {
			const firstApp = allApps[0];
			firstApp.hasInstaller = _appHasInstaller(firstApp);
			selectApp(firstApp.key);
		}

		setIsLoading(false);
	};

	const bootstrapClient = () => {
		setIsLoading(false);
		getAllApps().then((apps) => {
			setAllApps(apps);
			setTotalCount(apps?.length);
			setPageCount(Math.ceil(apps?.length / 20));
			getAppPage(1).then((apps) => {
				setPageContent(apps);
				selectApp(apps[0].key);
				setIsLoading(false);
			});
			setPage(1);
		});
	};

	const useInit = () => {
		return useEffect(() => {
			//console.log("Init");
			populateList();
			initPagination();
		}, []);
	};

	useEffect(() => {
		const index = inReverse ? pageContent.length - 1 : 0;
		pageContent?.length > 0 && selectApp(pageContent[index]?.key);
		setInReverse(false);
	}, [pageContent]);

	useEffect(() => {
		selectApp(selectedAppKey);
	}, [selectedAppKey]);

	useHotkeys("alt + b", () => gotoPrev());
	useHotkeys("alt + n", () => gotoNext());
	useHotkeys("alt + left", () => gotoPrev());
	useHotkeys("alt + right", () => gotoNext());
	useHotkeys("alt + n", () => addItem());
	useHotkeys("alt + e", () => editItem());
	useHotkeys("shift + alt + left", () => gotoPrevPage());
	useHotkeys("shift + alt + right", () => gotoNextPage());
	useHotkeys("alt + w", () => clearAppSelection());

	return {
		// ClientManager methods
		bootstrapClient,
		useInit,
		populateList,
		initPagination,
		deleteItem,
		updateItem,
		selectApp,
		editNewItem,
		editMode,
		setEditMode,
		getPage,
		gotoPrev,
		gotoNext,
		gotoPrevPage,
		gotoNextPage,
		applyFilter,
		restoreFilters,
		// StoreManager methods
		allApps,
		setAllApps,
		totalCount,
		setTotalCount,
		limit,
		setLimit,
		downloadGenericYaml,
		downloadGenericJson,
		downloadInstallDoctorYaml,
		selectedApp,
		setSelectedApp,
		selectedAppKey,
		setSelectedAppKey,
		closeApp,
		editItem,
		addItem,
		isEditMode: editMode,
		setIsEditeMode: setEditMode,
		page,
		pageCount,
		pageContent,
		setPage,
		setPageCount,
		setPageContent,
		filterModel,
		filteredResult,
		activeFilter,
		isLoading,
		setIsLoading,
		error,
		setError,
	};
};

// Component to provide the ClientContext
// function ClientProvider({ children }) {
// 	const contextValue = useClientManager();
// 	return (
// 		<ClientContext.Provider value={contextValue}>
// 			{children}
// 		</ClientContext.Provider>
// 	);
// }

// const ClientContext = createContext();

// const useClient = () => {
// 	const context = useContext(ClientContext);
// 	if (!context) {
// 		throw new Error(
// 			"The useClient hook must be used within a ClientProvider. \
// 			Add one to the component tree, outside of every component using it.",
// 		);
// 	}
// 	return context;
// };

// export { useClient, ClientProvider, useClientManager };
export { useClientManager };
