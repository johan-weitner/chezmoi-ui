import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { useHotkeys } from "react-hotkeys-hook";
import {
	fetchApp,
	getTotalCount,
	getAllApps,
	getAppPage,
	useAppPage,
	getApp,
	updateApp,
	addApp,
	deleteApp,
} from "api/appCollectionApi.js";
import {
	appViewModel,
	appModelFieldTypes,
	appModelInstallerFields,
} from "api/appModel";
import { filterModel } from "api/filters";

// Create a new React context
const ClientContext = createContext();
const PageContext = createContext();
const DataContext = createContext();

// Initialize a QueryClient
const queryClient = new QueryClient();

function usePageContext() {
	return useContext(PageContext);
}
function useDataContext() {
	return useContext(DataContext);
}

const _findIndex = (key, list) => {
	return list.findIndex((item) => item.key === key);
};

const useClientManager = () => {
	const [allApps, setAllApps] = useState([]);
	const [totalApps, setTotalApps] = useState(0);
	const [selectedApp, setSelectedApp] = useState(null);
	const [selectedAppKey, setSelectedAppKey] = useState(null);
	const [page, setPage] = useState(1);
	const [pageContext, setPageContent] = useState([]);
	const [limit, setLimit] = useState(20);
	const [pageCount, setPageCount] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [activeFilter, setActiveFilter] = useState(null);
	const [editMode, setEditMode] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const [error, setError] = useState(null);

	const queryClient = useQueryClient();
	const fetchAllApps = getAllApps;
	const setListSize = (size) => setTotalCount(size);
	const setNumPages = (size) => setPageCount(Math.ceil(size / limit));

	// useEffect(() => {
	// 	if (!appKey) {
	// 		selectApp(null);
	// 		return;
	// 	}
	// 	// getApp(appKey).then((app) => {
	// 	APP_FORM.formPartTwo.map((item) => {
	// 		if (selectedApp[item.name] && selectedApp[item.name].length > 0) {
	// 			setHasInstaller(true);
	// 			return;
	// 		}
	// 	});

	// 	// const appTags = app?.tags && JSON.parse(app.tags);
	// 	// appTags && setTags(appTags);
	// 	const appTags = {};
	// 	const indicateEdit = false;

	const isNullOrEmpty = (value) => {
		return value === null || value === undefined || value === "";
	};

	const appHasInstaller = (app) => {
		for (const field of appModelInstallerFields) {
			if (!isNullOrEmpty(app[field])) {
				return true;
			}
		}
		return false;
	};

	const populateList = () => {
		setIsLoading(true);
		getAllApps()
			.then((apps) => {
				setAllApps(apps);
				initPagination();
			})
			.then(() => {
				getAppPage(1).then((apps) => {
					setPageContent(apps);
					setIsLoading(false);
				});
			});
	};

	const initPagination = () => {
		setListSize(allApps?.length);
		setNumPages(allApps?.length);
		setPage(1);
		selectApp(allApps?.[0]);
	};

	const getPage = (page) => {
		setIsLoading(true);
		getAppPage(1).then((apps) => {
			setPageContent(apps);
			setIsLoading(false);
		});
	};

	const selectApp = (appKey) => {
		setIsLoading(true);
		getApp(appKey).then((app) => {
			app.hasInstaller = appHasInstaller(app);
			setSelectedApp(app);
			setSelectedAppKey(appKey);
			setIsLoading(false);
		});
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
		});
	};

	const updateItem = (app) => {
		setIsLoading(true);
		app.edited = true;
		updateApp(app.appKey).then(() => {
			setAllApps(...prev, app);
			setIsLoading(false);
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
		page > 1 && setPage(page - 1);
	};

	const gotoNextPage = () => {
		page < pageCount && setPage(page + 1);
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
		queryClient.invalidateQueries(["appCollection"]);
		queryClient.setQueryData(["appCollection"], filteredeApps);
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
		queryClient.invalidateQueries(["appCollection"]);
		queryClient.setQueryData(["appCollection"], appList);
		return appList;
	};

	// useHotkeys("alt + b", () => gotoPrev());
	// useHotkeys("alt + n", () => gotoNext());
	// useHotkeys("alt + left", () => gotoPrev());
	// useHotkeys("alt + right", () => gotoNext());
	// useHotkeys("alt + n", () => addItem());
	// useHotkeys("alt + e", () => editItem());
	// useHotkeys("shift + alt + left", () => gotoPrevPage());
	// useHotkeys("shift + alt + right", () => gotoNextPage());
	// useHotkeys("alt + w", () => unselectApp());

	useEffect(() => {
		populateList();
	}, []);

	useEffect(() => {
		getPage(page);
	}, [page]);

	useEffect(() => {
		initPagination();
	}, [allApps]);

	return {
		allApps,
		totalApps,
		populateList,
		initPagination,
		deleteItem,
		updateItem,
		addItem,
		selectApp,
		editItem,
		editNewApp: editNewItem,
		error,
		isLoading,
		editMode,
		setEditMode,
		selectedApp,
		selectedAppKey,
		page,
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

export { useClient, ClientProvider, useClientManager, useDataContext };
