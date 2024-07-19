import { createSelector } from "reselect";
import { isStartOfPage, isEndOfPage, findIndex } from "utils/pageUtils";

const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE;

/**
 * Raw selectors - these are the basic selectors that are used to get the data
 * from the store without the protection of memoization.
 */
export const getAppCollection = (state) => state.appCollection;

export const getPage = (state) => state.page;

export const getPageCount = (state) => state.pageCount;

export const getPageContent = (state) => state.pageContent;

export const getPageSize = (state) => state.pageSize;

export const getInReverse = (state) => state.inReverse;

export const getFilterModel = (state) => state.filterModel;

export const getActiveFilter = (state) => state.activeFilter;



export const getSelectedApp = (state) => state.selectedApp;

export const getSelectedAppKey = (state) => state.selectedAppKey;

export const getEditMode = (state) => state.editMode;

export const getPreviousKey = (state) => {
  const index = getCurrentIndex(state);
  if (index > 0) {
    return getAppCollection(state)[index - 1].key;
  }
  return getAppCollection(state)[0].key;
};

export const getNextKey = (state) => {
  const index = getCurrentIndex(state.appCollection, state.selectedAppKey);
  if (index < getAppCollection(state).length - 1) {
    return getAppCollection(state)[index + 1].key;
  }
  return getAppCollection(state)[getAppCollection(state).length - 1].key;
};



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

export const selectPageContent = createSelector(
  [getAppCollection, getPage, getPageSize],
  (appCollection, page, pageSize) => {
    const skip = page === 1 ? 0 : (page - 1) * pageSize;
    return appCollection?.slice(skip, skip + pageSize) || [];
  },
);

export const getCurrentIndex = createSelector(
  [getAppCollection, getSelectedAppKey],
  (appCollection, selectedAppKey) => {
    return findIndex(appCollection, selectedAppKey);
  },
);

export const getFilteredList = (state) => createSelector(
  [getActiveFilter, getAppCollection],
  (filter, appCollection) => {
    return getFilterModel()[filter].method(appCollection) || [];
  },
);

