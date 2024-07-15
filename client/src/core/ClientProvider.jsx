import React from "react";
import { createContext, useContext, useState } from "react";
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
const pageManager = (pageCount) => {
	let currentPage = 1;
	return {
		currentPage,
		pageCount,
		prevApp: () => {},
		nextApp: () => {},
		prevPage: () => {
			currentPage > 1 && currentPage--;
		},
		nextPage: () => {
			currentPage < pageCount && currentPage++;
		},
	};
};

const usePageManager = (
	initialPage = 1,
	initialLimit = 20,
	initialTotalCount = 0,
) => {
	const [page, setPage] = useState(initialPage);
	const [limit, setLimit] = useState(initialLimit);
	const [pageCount, setPageCount] = useState(1);
	const [totalCount, setTotalCount] = useState(initialTotalCount);
	const [activeFilter, setActiveFilter] = useState(null);

	const queryClient = useQueryClient();

	const setListSize = (size) => setTotalCount(size);
	const setNumPages = (size) => setPageCount(Math.ceil(size / limit));

	const gotoPrev = () => {
		setPage((prev) => Math.max(prev - 1, 1));
	};

	const gotoNext = () => {
		setPage((prev) => prev + 1);
	};

	const gotoPrevPage = () => {
		setPage((prev) => Math.max(prev - 10, 1));
	};

	const gotoNextPage = () => {
		setPage((prev) => prev + 10);
	};

	const initFilteredView = async (filter) => {
		setActiveFilter(filter);
		const filteredeApps = getAllApps().then((apps) => {
			const filteredApps = FILTER[filter].method(apps);
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
			setTotalCount(apps.length);
			setPageCount(Math.ceil(apps.length / limit));
			setPage(1);
			return apps;
		});
		queryClient.invalidateQueries(["appCollection"]);
		queryClient.setQueryData(["appCollection"], appList);
		return appList;
	};

	// const restoreFilters = () => {
	// 	queryClient.invalidateQueries(["appCollection"]);
	// };

	return {
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

const useDataManager = () => {
	const [allApps, setAllApps] = useState([]);
	const [totalApps, setTotalApps] = useState(0);
	const [selectedApp, setSelectedApp] = useState([]);

	// const apps = getAllApps().then((apps) => {
	// 	setAllApps(apps);
	// 	setTotalApps(apps?.length);
	// });
	const fetchAllApps = getAllApps;

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

	// const downloadGenericYaml = () => {
	// 	downloadYaml(allApps);
	// };

	// const downloadGenericJson = () => {
	// 	downloadJson(allApps);
	// };

	// const downloadInstallDoctorYaml = () => {
	// 	downloadInstallDoctorYaml(allApps);
	// };

	return {
		allApps,
		totalApps,
		setAllApps,
		fetchAllApps,
		deleteItem,
		updateItem,
		addItem,
		selectApp,
		selectedApp,
		// downloadGenericYaml,
		// downloadGenericJson,
		// downloadInstallDoctorYaml,
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
			pageManager: usePageManager(1, 20, allApps?.length || 0),
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
} /*
	getTotalCount,
	useAppCollection,
	useAppPage(skip, take),
	getNoInstallerApps,
	getNoUrlsApps,
	getNoDescApps,
	getNoNameApps,
	getApp(key),
	useAppMutation,
	addApp(appObj),
	deleteApp(key),
*/

/*
useEffect(() => {
		const apps = useAppPage(currentPage).then((apps) => {
			setSoftware(apps);
			if (apps && inReverse) {
				selectApp(apps[apps.length - 1]?.key);
			} else if (apps) {
				selectApp(apps[0]?.key);
			}
		});
	}, [currentPage, lastChange]);
*/

// Wrap your application with QueryClientProvider and ClientProvider
// function App() {
// 	return (
// 		<QueryClientProvider client={queryClient}>
// 			<ClientProvider>{/* Your application components */}</ClientProvider>
// 		</QueryClientProvider>
// 	);
// }

// // Example fetch function
// async function fetchAllApps() {
// 	// Fetch data from an API
// }

// // Example save or update function
// async function saveOrUpdateItem(item) {
// 	// Save or update item in an API
// }

// // Example delete function
// async function deleteItem(itemId) {
// 	// Delete item from an API
// }

export {
	useClient,
	ClientProvider,
	usePageManager,
	useDataManager,
	useDataContext,
	usePageContext,
};
