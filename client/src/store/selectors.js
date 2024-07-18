import { createSelector } from "reselect";
import { isStartOfPage, isEndOfPage, findIndex } from "utils/pageUtils";

const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE;

/**
 * Raw selectors - these are the basic selectors that are used to get the data
 * from the store without the protection of memoization.
 */
export const getAppCollection = (state) => state.appCollection;

export const getPage = (state) => state.pageContent;

export const getPageContent = (state) => state.pageContent;

export const getPageSize = (state) => state.pageSize;

export const getInReverse = (state) => state.inReverse;

export const getFilterModel = (state) => state.filterModel;

export const getActiveFilter = (state) => state.activeFilter;

export const getFilteredList = (state) => state.filteredList;

export const getSelectedApp = (state) => state.selectedApp;

export const getSelectedAppKey = (state) => state.selectedAppKey;

export const getEditMode = (state) => state.editMode;



/**
 * Memoized selectors - these are the selectors that are memoized to prevent
 * unnecessary re-renders.
 */
export const memoizedSelectApp = createSelector(
  [getAppCollection, getSelectedAppKey],
  (appCollection, selectedAppKey) => {
    return appCollection.find((app) => app.key === selectedAppKey);
  },
);
export const memoizedSelectAppByKey = (state, key) => {
  const appCollection = getAppCollection(state);
  const app = appCollection.find((app) => app.key === key);
  if (!app) {
    throw new Error(`App with key ${key} not found`);
  }
  return app;
};

