import { createSelector } from "reselect";
import { rootStore } from "./store";
import { isStartOfPage, isEndOfPage, findIndex } from "api/helpers";

const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE;
const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";

// FIXME: Memoize appCollection selector, then remove React Query.

const getAppCollection = (state) => state.appCollection;
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

// getAppCollection: memozied selector returning appCollection
const getMemoizedAppCollection = createSelector(
  [getAppCollection],
  (appCollection) => appCollection
);
export const getPreviousKey = (state) => {
  const appCollection = rootStore.get.appCollection();
  const index = getCurrentIndex(state);
  if (index > 0) {
    return appCollection[index - 1].key;
  }
  return appCollection[0].key;
};



export const getNextKey = () => {
  const index = getCurrentIndex();
  const appCollection = rootStore.get.appCollection();
  if (index < rootStore.get.totalCount() - 1) {
    return appCollection[index + 1].key;
  }
  return appCollection[appCollection?.length - 1].key;
};

export const selectPageContent = () => {
  DEBUG && console.log('SELECTOR: selectPageContent');
  const {
    appCollection,
    page,
    inReverse,
    pageContent
  } = rootStore.store.getState();
  const skip = page < 2 ? 0 : (page - 1) * PAGE_SIZE;
  const cutoff = skip + Number.parseInt(PAGE_SIZE, 10);
  DEBUG && console.log('Slicing: ', page, skip, cutoff);
  const slice = (Array.isArray(appCollection) && appCollection.length > 20)
    && appCollection.slice(skip, cutoff) || [];

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

export const selectApp = (selectedAppKey) => {
  const appCollection = rootStore.get.appCollection();
  console.log('SELECTORS: selectApp: ', appCollection);
  return rootStore.get.appCollection().find((app) => app.key === selectedAppKey);
};

export const selectAppByKey = (key) => {
  const appCollection = rootStore.get.appCollection();
  console.log('SELECTORS: selectAppByKey: ', appCollection);
  const app = rootStore.get.appCollection().find((app) => app.key === key);
  if (!app) {
    throw new Error(`App with key ${key} not found`);
  }
  return app;
};

export const getFilteredList = (filter, appCollection) => {
  const filters = rootStore.get.filterModel();
  return filters[filter].method(appCollection) || [];
};

export { getMemoizedAppCollection as getAppCollection };