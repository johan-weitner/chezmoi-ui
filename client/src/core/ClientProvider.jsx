import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient, QueryClient } from "@tanstack/react-query";
import { useHotkeys } from "react-hotkeys-hook";
import {
	getAllApps,
	getAppPage,
	getAppPagee,
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
	const [allApps, setAllApps] = useState([]);
	const [totalApps, setTotalApps] = useState(0);
	const [selectedApp, setSelectedApp] = useState(null);
	const [selectedAppKey, setSelectedAppKey] = useState(null);
	const [page, setPage] = useState(1);
	const [pageContent, setPageContent] = useState([]);
	const [limit, setLimit] = useState(20);
	const [pageCount, setPageCount] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [activeFilter, setActiveFilter] = useState(null);
	const [editMode, setEditMode] = useState(null);
	const [inReverse, setInReverse] = useState(false);
	const [isLoading, setIsLoading] = useState(null);
	const [error, setError] = useState(null);

	const queryClient = useQueryClient();
	// const queryClient = new QueryClient();
	const setListSize = (size) => setTotalCount(size);
	const setNumPages = (size) => setPageCount(Math.ceil(size / limit));

	const isNullOrEmpty = (value) => {
		return value === null || value === undefined || value === "";
	};

	const appHasInstaller = (app) => {
		for (const field of appModelInstallerFields) {
			if (app && !isNullOrEmpty(app[field])) {
				return true;
			}
		}
		return false;
	};

	const invalidateCache = () => {
		queryClient.invalidateQueries(["appCollection", "appPage"]);
		// queryClient.setQueryData(["appCollection"], filteredeApps);
	};

	const populateList = (page = 1) => {
		console.log(`*** Populating list - viewing page ${page} ***`);
		setIsLoading(true);
		getAllApps().then((apps) => {
			setAllApps(apps);
			setListSize(apps?.length);
			setNumPages(apps?.length);
			setPage(page);
			getAppPagee(page).then((apps) => {
				console.log("PopulateList: ", apps?.length);
				setPageContent(apps);
				selectApp(apps[0].key);
				setIsLoading(false);
				invalidateCache();
			});
		});
	};

	const initPagination = (page = 1) => {
		setListSize(allApps?.length);
		setNumPages(Math.ceil(allApps?.length / 20));
		setPage(page);
		console.table({
			page,
			totalApps,
			pageCount,
			totalCount,
		});
		if (allApps.length > 0) {
			const firstApp = allApps[0];
			firstApp.hasInstaller = appHasInstaller(firstApp);
			setSelectedApp(firstApp);
			setSelectedAppKey(firstApp.key);
		}

		setIsLoading(false);
	};

	const getPage = (page) => {
		console.log(`Getting page: ${page}`);
		setIsLoading(true);
		getAppPagee(page).then((apps) => {
			console.log("Got page", apps);
			setPage(page);
			setPageContent(apps);
			setIsLoading(false);
			invalidateCache();
			queryClient.setQueryData(["appPage"], apps);
		});
	};

	const selectApp = (appKey) => {
		setIsLoading(true);
		getApp(appKey).then((app) => {
			if (!app) {
				console.warn("Found no app with key: ", appKey);
				setIsLoading(false);
				return;
			}
			app.hasInstaller = appHasInstaller(app);
			setSelectedApp(app);
			setSelectedAppKey(appKey);
			setIsLoading(false);
		});
	};

	const unselectApp = () => {
		setSelectedApp(null);
		setSelectedAppKey(null);
	};

	const editItem = (appKey) => {
		console.log("Edit");
		if (appKey) {
			console.log("Getting app...");
			setIsLoading(true);
			getApp(appKey).then((app) => {
				setSelectedApp(app);
				setSelectedAppKey(appKey);
				setEditMode(true);
				setIsLoading(false);
			});
		} else {
			console.log("Set edit mode");
			setEditMode(true);
		}
	};

	const deleteItem = (appKey) => {
		setIsLoading(true);
		deleteApp(appKey).then(() => {
			setAllApps((prev) => prev.filter((app) => app.key !== appKey));
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
		console.log("Edit new item");
		setSelectedApp(null);
		setSelectedAppKey(null);
		setEditMode(true);
	};

	const addItem = (app) => {
		setIsLoading(true);
		addApp(app).then(() => {
			setAllApps(...prev, app);
			setIsLoading(false);
			invalidateCache();
		});
	};

	const gotoPrev = () => {
		if (selectedAppKey) {
			const index = _findIndex(selectedAppKey, allApps);
			index > 0 && selectApp(allApps[index - 1].key);
			page > 1 && getPage(page - 1);
		} else {
			selectApp(pageContent[0].key);
		}
	};

	const gotoNext = () => {
		console.log(selectedAppKey);
		if (selectedAppKey) {
			const index = _findIndex(selectedAppKey, allApps);
			index < pageContent.length - 1 && selectApp(pageContent[index + 1].key);
			// page < pageCount && getPage(page + 1);
		} else {
			Array.isArray(pageContent) && selectApp(pageContent[0].key);
		}
	};

	const gotoPrevPage = () => {
		page > 1 && getPage(page - 1);
	};

	const gotoNextPage = () => {
		console.log(`Turning page from ${page} to ${page + 1}`);
		console.log(`PageCount ${pageCount}`);
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

	useHotkeys("alt + b", () => gotoPrev());
	useHotkeys("alt + n", () => gotoNext());
	useHotkeys("alt + left", () => gotoPrev());
	useHotkeys("alt + right", () => gotoNext());
	useHotkeys("alt + n", () => addItem());
	useHotkeys("alt + e", () => editItem());
	useHotkeys("shift + alt + left", () => gotoPrevPage());
	useHotkeys("shift + alt + right", () => gotoNextPage());
	useHotkeys("alt + w", () => unselectApp());

	const useInit = () => {
		return useEffect(() => {
			console.log("Init");
			populateList(page);
			initPagination(page);
		}, []);
	};

	useEffect(() => {
		console.log("New page content - selecting first item");
		pageContent && setSelectedApp(pageContent[0]?.key);
		pageContent && setSelectedAppKey(pageContent[0]?.key);
	}, [pageContent]);

	return {
		useInit,
		allApps,
		totalApps,
		populateList,
		initPagination,
		deleteItem,
		updateItem,
		addItem,
		selectApp,
		editItem,
		editNewItem,
		error,
		isLoading,
		editMode,
		setEditMode,
		selectedApp,
		selectedAppKey,
		page,
		pageContent,
		limit,
		totalCount,
		pageCount,
		getPage,
		setLimit,
		gotoPrev,
		gotoNext,
		gotoPrevPage,
		gotoNextPage,
		applyFilter,
		restoreFilters,
		activeFilter,
	};
};

// Component to provide the ClientContext
function ClientProvider({ children }) {
	const contextValue = useClientManager();
	return (
		<ClientContext.Provider value={contextValue}>
			{children}
		</ClientContext.Provider>
	);
}

const useClient = () => {
	const context = useContext(ClientContext);
	if (!context) {
		throw new Error(
			"The useClient hook must be used within a ClientProvider. \
			Add one to the component tree, outside of every component using it.",
		);
	}
	return context;
};

const ClientContext = createContext();

export { useClient, ClientProvider, useClientManager };
