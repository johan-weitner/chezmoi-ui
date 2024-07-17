import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient, QueryClient } from "@tanstack/react-query";
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

const providerModel = {
	data: {
		allApps: [],
		filteredResult: [],
		setAllApps: null,
		saveOrUpdateItem: null,
		deleteItem: null,
		downloadGenericYaml: null,
		downloadGenericJson: null,
		downloadInstallDoctorYaml: null,
	},
	view: {
		mode: "default",
		selectedItem: null,
		selectedItemKey: null,
		detailView: {
			isOpen: false,
			fallback: Legend,
		},
		editView: {
			isOpen: false,
		},
		pageManager: {
			currentPage,
			pageCount,
			prevApp,
			nextApp,
			prevPage,
			nextPage,
		},
		filterManager: {
			filterModel,
			activeFilter,
			applyFilter,
			clearFilter,
		},
		selectItem: null,
		closeItem: null,
		editItem: null,
		addItem: null,
		openSpotlightSearch: null,
	},
};

const useClientManager = () => {
	const [allApps, setAllApps] = useState([]);
	const [totalApps, setTotalApps] = useState(0);
	const [selectedApp, setSelectedApp] = useState(null);
	const [selectedAppKey, setSelectedAppKey] = useState(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageContent, setPageContent] = useState([]);
	const [limit, setLimit] = useState(20);
	const [pageCount, setPageCount] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [activeFilter, setActiveFilter] = useState(null);
	const [editMode, setEditMode] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const [error, setError] = useState(null);

	const queryClient = useQueryClient();
	// const queryClient = new QueryClient();
	useHotkeys("alt + b", () => gotoPrev());
	useHotkeys("alt + n", () => gotoNext());
	useHotkeys("alt + left", () => gotoPrev());
	useHotkeys("alt + right", () => gotoNext());
	useHotkeys("alt + n", () => addItem());
	useHotkeys("alt + e", () => editItem());
	useHotkeys("shift + alt + left", () => gotoPrevPage());
	useHotkeys("shift + alt + right", () => gotoNextPage());
	useHotkeys("alt + w", () => unselectApp());

	useEffect(() => {
		populateList();
	}, []);

	useEffect(() => {
		initPagination();
	}, [allApps, pageContent]);

	// Internal methods
	const _setListSize = (size) => setTotalCount(size);
	const _setNumPages = (size) => setPageCount(Math.ceil(size / limit));

	const _isNullOrEmpty = (value) => {
		return value === null || value === undefined || value === "";
	};

	const _appHasInstaller = (app) => {
		for (const field of appModelInstallerFields) {
			if (app && !isNullOrEmpty(app[field])) {
				return true;
			}
		}
		return false;
	};

	const _invalidateCache = () => {
		queryClient.invalidateQueries(["appCollection", "appPage"]);
		// queryClient.setQueryData(["appCollection"], filteredeApps);
	};

	const _populateList = () => {
		setIsLoading(true);
		getAllApps()
			.then((apps) => {
				setAllApps(apps);
				initPagination();
			})
			.then(() => {
				getAppPage(1).then((apps) => {
					console.log("PopulateList: ", apps);
					setPageContent(apps);
					setIsLoading(false);
					invalidateCache();
				});
			});
	};

	const _initPagination = () => {
		setListSize(allApps?.length);
		setNumPages(allApps?.length);
		setPage(1);
		if (allApps.length > 0) {
			const firstApp = allApps[0];
			firstApp.hasInstaller = appHasInstaller(firstApp);
			setSelectedApp(firstApp);
			setSelectedAppKey(firstApp.key);
		}

		setIsLoading(false);
	};
	// /Internal methods

	// Public methods
	const getPage = (page) => {
		console.log(`Getting page: ${page}`);
		setIsLoading(true);
		getAppPage(page).then((apps) => {
			console.log(apps);
			setPage(page);
			setPageContent(apps);
			setIsLoading(false);
			invalidateCache();
		});
	};

	const selectItem = (appKey) => {
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

	const closeItem = () => {
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

	const saveUpdatedItem = (app) => {
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

	const saveNewItem = (app) => {
		setIsLoading(true);
		addApp(app).then(() => {
			setAllApps(...prev, app);
			setIsLoading(false);
			invalidateCache();
		});
	};

	const gotoPrev = () => {
		const index = _findIndex(selectedAppKey, allApps);
		if (index === 0) return;
		const nextApp = allApps[index - 1];
		setSelectedApp(nextApp);
		setSelectedAppKey(nextApp.key);
	};

	const gotoNext = () => {
		const index = _findIndex(selectedAppKey, allApps);
		if (index === allApps?.length - 1) return;
		const nextApp = allApps[index + 1];
		setSelectedApp(nextApp);
		setSelectedAppKey(nextApp.key);
	};

	const gotoPrevPage = () => {
		page > 1 && getPage(page - 1);
	};

	const gotoNextPage = () => {
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

	const clearFilter = async () => {
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
	// /Public methods

	const dataManager = {
		allApps,
		setAllApps,
		saveNewItem,
		saveUpdatedItem,
		deleteItem,
		downloadGenericYaml: null,
		downloadGenericJson: null,
		downloadInstallDoctorYaml: null,
	};
	const viewManager = {
		mode: "default",
		selectedItem,
		selectedItemKey,
		detailView: {
			isOpen: false,
			fallback: Legend,
		},
		editView: {
			isOpen: false,
		},
		selectItem,
		closeItem,
		editItem,
	};
	const pageManager = {
		currentPage,
		totalSize,
		pageCount,
		pageSize,
		pageContent,
		gotoPrev,
		gotoNext,
		gotoPrevPage,
		gotoNextPage,
	};
	const filterManager = {
		filters: [],
		filteredResult: [],
		activeFilter,
		applyFilter,
		clearFilter,
	};

	return {
		useClientManager,
		dataManager,
		viewManager,
		pageManager,
		filterManager,
		error,
		isLoading,
	};
}; // useClientManager

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
