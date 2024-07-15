import { createContext } from "react";
import {
	deleteApp,
	getNoInstallerApps,
	getNoUrlsApps,
	getNoDescApps,
	getNoNameApps,
} from "api/appCollectionApi.js";
import Legend from "components/DetailView/Legend";

/* Methods */
const unselectApp = () => {
	setSelectedAppKey(null);
	setIsPopoverOpen(false);
};

const addItem = () => {
	setSelectedAppKey(null);
	setIsPopoverOpen(true);
};

const editItem = (key = selectedAppKey) => {
	if (key !== selectedAppKey) {
		setSelectedAppKey(key);
	}
	selectedAppKey && setIsPopoverOpen(true);
};

const deleteItem = (key = selectedAppKey) => {
	deleteApp(key).then((res) => {
		console.log("Deleted app: ", res);
	});
};

const updateCurrentListKeys = (keys) => {
	setCurrentListKeys(keys);
};

const selectApp = (key) => {
	console.log(`Selected app with key: ${key}`);
	setSelectedAppKey(key);
	setInReverse(false);
};

const findIndex = (key) => {
	return currentListKeys.findIndex((item) => item.key === key);
};

const gotoPrev = () => {
	console.log(
		`selectedAppKey: ${selectedAppKey}, currentListKeys: ${currentListKeys}`,
	);
	if (selectedAppKey) {
		const index = findIndex(selectedAppKey);
		if (index > 0) {
			const prevKey = currentListKeys[index - 1].key;
			selectApp(prevKey);
		} else if (currentPage > 1) {
			console.log("Reached beginning of page, flipping to previous page...");
			setInReverse(true);
			setCurrentPage(currentPage - 1);
		}
	}
	console.log(`selectedAppKey: ${selectedAppKey}, index: ${index}`);
};

const gotoNext = () => {
	if (selectedAppKey) {
		const index = findIndex(selectedAppKey);
		if (index < currentListKeys.length - 1) {
			const nextKey = currentListKeys[index + 1].key;
			selectApp(nextKey);
		} else if (currentPage < numPages) {
			console.log("Reached end of page, flipping to next page...");
			setCurrentPage(currentPage + 1);
		}
	}
};

const gotoPrevPage = () => {
	if (currentPage > 1) {
		setCurrentPage(currentPage - 1);
	}
};

const gotoNextPage = () => {
	if (currentPage < numPages) {
		setCurrentPage(currentPage + 1);
	}
};

const initFilteredView = () => {
	setFilteredView(null);
	setUseFilter(true);
	setSelectedAppKey(null);
};

const restoreFilters = () => {
	setFilteredView(null);
	setUseFilter(false);
	setTotalCount(1);
	setCurrentListKeys([]);
	setNumPages(1);
	setSelectedAppKey(null);
};
/* /Methods */

/**
 * ClientContext.jsx
 *
 * This file defines a React context for managing client-related data and UI state across the application.
 * It uses the createContext API from React to create a new context with default values.
 *
 * Exports:
 * - ClientContext: A React context object with predefined structure for data and view management.
 *
 * Structure:
 * - data: Contains application data and functions for manipulating this data.
 *   - allApps: An array of objects representing all applications.
 *   - filteredResult: An array of objects representing filtered applications based on some criteria.
 *   - setAllApps: A function to update the allApps array.
 *   - saveOrUpdateItem: A function to save or update an application item.
 *   - deleteItem: A function to delete an application item based on its key.
 *   - downloadGenericYaml, downloadGenericJson, downloadInstallDoctorYaml: Functions for downloading files.
 *
 * - view: Contains UI state and functions for manipulating the view.
 *   - mode: A string indicating the current view mode ("default" or "filteredView").
 *   - selectedItem: An object representing the currently selected item.
 *   - selectedItemKey: A string representing the key of the currently selected item.
 *   - detailView: An object representing the state of the detail view, including whether it's open and a fallback component.
 *   - editView: An object representing the state of the edit view, including whether it's open.
 *   - pageManager: An object for managing pagination, including the current page, total page count, and functions for navigating pages.
 *   - filterManager: An object for managing filters, including the active filter, an array of filters, and functions for applying and clearing filters.
 *   - selectItem, closeItem, editItem, addItem, openSpotlightSearch: Functions for managing items and UI interactions.
 *
 * Additional Functions:
 * - pageManager: A utility function for creating a page manager object with currentPage and pageCount.
 * - filterManager: A utility function for creating a filter manager object with filters and activeFilter.
 * - detailView: A utility function for creating a detail view object with isOpen, currentItem, and fallback component.
 * - editView: A utility function for creating an edit view object with isOpen and currentItem.
 * - unselectApp, addItem, editItem, deleteItem, updateCurrentListKeys, selectApp, findIndex, gotoPrev, gotoNext, gotoPrevPage, gotoNextPage, initFilteredView, restoreFilters: Additional functions for managing UI state and interactions.
 *
 */
export const ClientContext = createContext({
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
});

const pageManager = (pageCount = 1, currentPage = 1) => {
	return {
		currentPage,
		pageCount,
	};
};

const filterManager = (filters = [], activeFilter = null) => {
	return {
		filters,
		activeFilter,
	};
};

const detailView = (isOpen = false, currentItem = null, fallback = Legend) => {
	return {
		isOpen,
		currentItem,
		fallback,
	};
};

const editView = (isOpen = false, currentItem = null) => {
	return {
		isOpen,
		currentItem,
	};
};

// export default ClientContext;
