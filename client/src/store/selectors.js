import { createSelector } from "reselect";
import { rootStore } from "./store";
import { isStartOfPage, isEndOfPage, findIndex } from "utils/pageUtils";

const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE;
const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";
const state = rootStore.store.getState();
const { store } = rootStore;
const { getState } = store;

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
  const index = getCurrentIndex();
  const appCollection = rootStore.get.appCollection();
  if (index < rootStore.get.totalCount() - 1) {
    return appCollection[index + 1].key;
  }
  return appCollection[appCollection?.length - 1].key;
};

export const selectPageContent = (state) => {
  DEBUG && console.log('SELECTOR: selectPageContent');
  const {
    appCollection,
    page,
    inReverse,
    pageContent
  } = state;
  const skip = page < 2 ? 0 : (page - 1) * PAGE_SIZE;
  const cutoff = skip + Number.parseInt(PAGE_SIZE, 10);
  DEBUG && console.log('Slicing: ', page, skip, cutoff);
  const slice = appCollection?.slice(skip, cutoff) || [];

  rootStore.set.selectedAppKey(inReverse ? slice[slice.length - 1]?.key : slice[0]?.key);

  DEBUG && pageContent && console.log(pageContent[0]?.key);
  DEBUG && pageContent && console.log(slice[0]?.key);
  DEBUG && console.log(pageContent);
  return slice;
};

export const getCurrentIndex = () => {
  const appCollection = rootStore.get.appCollection();
  const selectedAppKey = rootStore.get.selectedAppKey();
  return findIndex(selectedAppKey, appCollection);
};

export const selectApp = (appCollection, selectedAppKey) => {
  return appCollection.find((app) => app.key === selectedAppKey);
};

export const selectAppByKey = (key) => {
  const appCollection = rootStore.get.appCollection();
  const app = appCollection.find((app) => app.key === key);
  if (!app) {
    throw new Error(`App with key ${key} not found`);
  }
  return app;
};



/**
 * Memoized selectors - to prevent unnecessary re-renders.
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

export const selectMemoizedPageContent = createSelector(
  getState,
  (state) => {
    const { appCollection, page, pageSize } = state;
    const skip = page === 1 ? 0 : (page - 1) * pageSize;
    return appCollection?.slice(skip, skip + pageSize) || [];
  },
);

export const getFilteredList = (state) => createSelector(
  [getActiveFilter, getAppCollection],
  (filter, appCollection) => {
    return getFilterModel()[filter].method(appCollection) || [];
  },
);
