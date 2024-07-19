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
  selectPageContent
} from "store/selectors";
import {
  useAppCollectionStore,
  usePageStore,
  useSelectionStore
} from "store/store";
import { getAllApps } from "api/appCollectionApi";

// const appCollectionStore = useAppCollectionStore();
// const pageStore = usePageStore();
// const selectionStore = useSelectionStore();

const {
  setAppCollection,
  saveUpdatedApp,
  saveNewApp
} = useAppCollectionStore();

const {
  setPage,
  setPageCount,
  setPageSize,
  setInReverse,
  setActiveFilter,
  setFilteredList
} = pageStore();



const { setSelectedApp, setSelectedAppKey, setEditMode } = selectionStore();

export const useClientManager = () => {
  // const seedStore = () => {
  //   getAllApps().then((apps) => {
  //     setAppCollection(apps);
  //     setPageCount(Math.ceil(apps.length / getPageSize(pageStore)));
  //   });
  // };

  // const refreshStore = () => {
  //   getAllApps().then((apps) => {
  //     setAppCollection(apps);
  //     setPageCount(Math.ceil(apps.length / getPageSize(pageStore)));
  //   });
  // };

  const getPageContent = (page) => {
    setPage(page);
    selectPageContent(getAppCollection, page);
  };

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