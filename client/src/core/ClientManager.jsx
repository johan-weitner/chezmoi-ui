import React from "react";
import { useState, useEffect } from "react";
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
import { getAllApps } from "api/appCollectionApi";

// const appStore = appCollectionStore();
// const pageStore = usePageStore();
// const selectionStore = useSelectionStore();

// const {
//   setAppCollection,
//   saveUpdatedApp,
//   saveNewApp
// } = useAppCollectionStore();

// const {
// 	setPage,
// 	setPageCount,
// 	setPageSize,
// 	setInReverse,
// 	setActiveFilter,
// 	setFilteredList,
// } = usePageStore();

// const { setSelectedApp, setSelectedAppKey, setEditMode } = useSelectionStore();

export const useClientManager = () => {
	const { store } = rootStore;
	const state = store.getState();

	const seedStore = () => {
		getAllApps().then((apps) => {
			rootStore.set.appCollection(apps);
			rootStore.set.pageCount(
				Math.ceil(apps.length / rootStore.get.pageSize()),
			);
			rootStore.set.page(1);
			openFirstPage();
		});
	};

	const openFirstPage = () => {
		const apps = selectPageContent(state);
		rootStore.set.pageContent(apps);
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
	// const gotoPrevPage = () => {
	//   const currPage = getPage(pageStore);
	//   if (currPage > 0) {
	//     setPage(currPage - 1);
	//   }
	// };
	// const gotoNextPage = () => {
	//   const currPage = getPage(pageStore);
	//   const pageCount = getPageCount(pageStore);
	//   if (currPage < pageCount - 1) {
	//     setPage(currPage + 1);
	//   }
	// };
	// const setFilter = (filter) => {
	//   setActiveFilter(filter);
	//   setFilteredList(getFilteredList(filterModel, filter));
	// };
	return {
		seedStore,
		openFirstPage,
		refreshAppCollection,
		selectPrevApp,
		selectNextApp,
	};
};

// useHotkeys("alt + b", () => gotoPrev());
// useHotkeys("alt + n", () => gotoNext());
// useHotkeys("alt + left", () => gotoPrev());
// useHotkeys("alt + right", () => gotoNext());
// useHotkeys("alt + n", () => addItem());
// useHotkeys("alt + e", () => editItem());
// useHotkeys("shift + alt + left", () => gotoPrevPage());
// useHotkeys("shift + alt + right", () => gotoNextPage());
// useHotkeys("alt + w", () => clearAppSelection());
