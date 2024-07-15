import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import {
	fetchApp,
	getTotalCount,
	getAllApps,
	useAppPage,
	getNoInstallerApps,
	getNoUrlsApps,
	getNoDescApps,
	getNoNameApps,
	getApp,
	updateApp,
	addApp,
	deleteApp,
} from "api/appCollectionApi.js";
import Legend from "components/DetailView/Legend";
import { FILTER } from "api/appCollectionApi";

// Create a new React context
const ClientContext = createContext();
const PageContext = createContext();
const DataContext = createContext();

// Initialize a QueryClient
const queryClient = new QueryClient();

// Custom hook to use the ClientContext
function useClient() {
	return useContext(ClientContext);
}
function usePageContext() {
	return useContext(PageContext);
}
function useDataContext() {
	return useContext(DataContext);
}

/*
	data: {
		allApps: [], // Array<Object>
		filteredResult: [], // Array<Object>
		setAllApps: null, // function: @arg Array<
		saveOrUpdateItem: null, // function: @arg app {Object}
		deleteItem: null, // function: @arg appKey {string}
		downloadGenericYaml: null, // function: void
		downloadGenericJson: null, // function: void
		downloadInstallDoctorYaml: null, // function: void
	},
	view: {
		mode: "default", // string: "default" | "filteredView"
		selectedItem: null, // Object
		selectedItemKey: null, // string
		detailView: {
			isOpen: false, // boolean
			fallback: Legend, // ReactComponent
		},
		editView: {
			isOpen: false, // boolean
		},
		pageManager: {
			currentPage: null, // number
			pageCount: 0, // number
			prevApp: null, // Function
			nextApp: null, // Function
			prevPage: null, // Function
			nextPage: null, // Function
		},
		filterManager: {
			filters: [], // Array<Object>
			activeFilter: null, // string
			applyFilter: null, // Function
			clearFilter: null, // Function
		},
		selectItem: null, // Function @arg appKey {string}
		closeItem: null, // Function
		editItem: null, // Function
		addItem: null, // Function
		openSpotlightSearch: null, // Function
	},
*/

// const usePageManager = (
// 	initialPage = 1,
// 	initialLimit = 20,
// 	initialTotalCount = 0,
// ) => {
// 	const [page, setPage] = useState(initialPage);
// 	const [limit, setLimit] = useState(initialLimit);
// 	const [pageCount, setPageCount] = useState(1);
// 	const [totalCount, setTotalCount] = useState(initialTotalCount);
// 	const [activeFilter, setActiveFilter] = useState(null);

// 	const queryClient = useQueryClient();

// 	const setListSize = (size) => setTotalCount(size);
// 	const setNumPages = (size) => setPageCount(Math.ceil(size / limit));

// 	const gotoPrev = () => {
// 		setPage((prev) => Math.max(prev - 1, 1));
// 	};

// 	const gotoNext = () => {
// 		setPage((prev) => prev + 1);
// 	};

// 	const gotoPrevPage = () => {
// 		setPage((prev) => Math.max(prev - 10, 1));
// 	};

// 	const gotoNextPage = () => {
// 		setPage((prev) => prev + 10);
// 	};

// 	const initFilteredView = async (filter) => {
// 		setActiveFilter(filter);
// 		const filteredeApps = getAllApps().then((apps) => {
// 			const filteredApps = FILTER[filter].method(apps);
// 			setTotalCount(filteredApps.length);
// 			setPageCount(Math.ceil(filteredApps.length / limit));
// 			setPage(1);
// 			return FILTER[filter].method(apps);
// 		});
// 		queryClient.invalidateQueries(["appCollection"]);
// 		queryClient.setQueryData(["appCollection"], filteredeApps);
// 		return filteredeApps;
// 	};

// 	const restoreFilters = async (filter) => {
// 		setActiveFilter(null);
// 		const appList = getAllApps().then((apps) => {
// 			setTotalCount(apps.length);
// 			setPageCount(Math.ceil(apps.length / limit));
// 			setPage(1);
// 			return apps;
// 		});
// 		queryClient.invalidateQueries(["appCollection"]);
// 		queryClient.setQueryData(["appCollection"], appList);
// 		return appList;
// 	};

// 	return {
// 		page,
// 		limit,
// 		totalCount,
// 		pageCount,
// 		setListSize,
// 		setNumPages,
// 		setPage,
// 		setLimit,
// 		gotoPrev,
// 		gotoNext,
// 		gotoPrevPage,
// 		gotoNextPage,
// 		initFilteredView,
// 		restoreFilters,
// 		activeFilter,
// 	};
// };

const findIndex = (key, list) => {
	return list.findIndex((item) => item.key === key);
};

const useDataManager = () => {
	const [allApps, setAllApps] = useState([]);
	const [totalApps, setTotalApps] = useState(0);
	const [selectedApp, setSelectedApp] = useState(null);
	const [selectedAppKey, setSelectedAppKey] = useState(null);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const [pageCount, setPageCount] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [activeFilter, setActiveFilter] = useState(null);

	const queryClient = useQueryClient();
	const fetchAllApps = getAllApps;
	const setListSize = (size) => setTotalCount(size);
	const setNumPages = (size) => setPageCount(Math.ceil(size / limit));

	const populateList = () => {
		fetchAllApps().then((apps) => {
			setAllApps(apps);
			setListSize(apps.length);
			setNumPages(apps.length);
			setPage(1);
			selectApp(apps[0]);
		});
	};

	const selectApp = (appKey) => {
		getApp(appKey).then((app) => {
			setSelectedApp(app);
		});
	};

	const deleteItem = (appKey) => {
		deleteApp(appKey).then(() => {
			setAllApps((prev) => prev.filter((app) => app.key !== appKey));
		});
	};

	const updateItem = (app) => {
		updateApp(app.appKey).then(() => {
			setAllApps(...prev, app);
		});
	};

	const addItem = (app) => {
		addApp(app).then(() => {
			setAllApps(...prev, app);
		});
	};

	const gotoPrev = () => {
		const index = findIndex(selectedAppKey, allApps);
		if (index === 0) return;
		const nextApp = allApps[index - 1];
		setSelectedApp(nextApp);
		setSelectedAppKey(nextApp.key);
	};

	const gotoNext = () => {
		const index = findIndex(selectedAppKey, allApps);
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

	const initFilteredView = async (filter) => {
		setActiveFilter(filter);
		const filteredeApps = getAllApps().then((apps) => {
			const filteredApps = FILTER[filter].method(apps);
			setAllApps(filteredApps);
			setTotalCount(filteredApps.length);
			setPageCount(Math.ceil(filteredApps.length / limit));
			setPage(1);
			return FILTER[filter].method(apps);
		});
		queryClient.invalidateQueries(["appCollection"]);
		queryClient.setQueryData(["appCollection"], filteredeApps);
		return filteredeApps;
	};

	const restoreFilters = async (filter) => {
		setActiveFilter(null);
		const appList = getAllApps().then((apps) => {
			setAllApps(apps);
			setTotalCount(apps.length);
			setPageCount(Math.ceil(apps.length / limit));
			setPage(1);
			return apps;
		});
		queryClient.invalidateQueries(["appCollection"]);
		queryClient.setQueryData(["appCollection"], appList);
		return appList;
	};

	useEffect(() => {
		fetchAllApps().then((apps) => {
			setAllApps(apps);
			setListSize(apps.length);
			setNumPages(apps.length);
		});
	}, []);

	useEffect(() => {
		setListSize(allApps.length);
		setNumPages(allApps.length);
		setPage(1);
	}, [allApps]);

	return {
		allApps,
		totalApps,
		setAllApps,
		populateList,
		fetchAllApps,
		deleteItem,
		updateItem,
		addItem,
		selectApp,
		selectedApp,
		selectedAppKey,
		setSelectedAppKey,
		page,
		limit,
		totalCount,
		pageCount,
		setListSize,
		setNumPages,
		setPage,
		setLimit,
		gotoPrev,
		gotoNext,
		gotoPrevPage,
		gotoNextPage,
		initFilteredView,
		restoreFilters,
		activeFilter,
	};
};

// Component to provide the ClientContext
function ClientProvider({ children }) {
	let { data: allApps } = getAllApps();
	let totalCount = getTotalCount();
	let pageCount = Math.ceil(totalCount / 20);
	let selectedItem = null;
	let selectedItemKey = null;
	const detailView = {
		isOpen: false,
		Fallback: <Legend />,
	};

	const selectItem = (appKey) => {
		console.log("appKey", appKey);
		getApp(appKey).then((app) => {
			selectedItem = app;
			selectedItemKey = app.key;
			detailView.isOpen = true;
		});
	};

	const closeItem = () => {
		selectedItem = null;
		selectedItemKey = null;
		detailView.isOpen = false;
	};

	// Define the context value
	const contextValue = {
		data: {
			allApps,
			refetchAllApps: getAllApps,
			useAppMutation: updateApp,
			addApp,
			deleteApp,
		},
		// Add view management state and functions here
		view: {
			mode: "default",
			selectedItem,
			selectedItemKey,
			detailView,
			editView: {
				isOpen: false, // boolean
			},
			// pageManager: usePageManager(1, 20, allApps?.length || 0),
			filterManager: {},
			selectItem,
			closeItem: null, // Function
			editItem: null, // Function
			addItem: null, // Function
		},
	};

	return (
		<ClientContext.Provider value={contextValue}>
			{children}
		</ClientContext.Provider>
	);
}

export { useClient, ClientProvider, useDataManager, useDataContext };
