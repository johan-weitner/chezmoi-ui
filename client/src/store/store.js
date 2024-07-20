import React from "react";
import { create } from 'zustand';
import { createStore } from 'zustand-x'
import { QueryClient } from "@tanstack/react-query";
import {
  getAllApps,
  getAppPage,
  getApp,
  updateApp,
  addApp,
  deleteApp,
} from "api/appCollectionApi.js";
import { appModelInstallerFields } from "api/appModel";
import { filterModel } from "api/filters";
// import Legend from 'views/DetailView/Legend';

export const useStore = () => { };

const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE, 10);

// const initialAppCollectionStore = createStore('apps')({
//   appCollection: [],
//   totalCount: 0,
//   setAppCollection: (apps) => {
//     set({ appCollection: apps });
//   },
//   saveUpdatedApp: (app) => {
//     set((state) => ({
//       appCollection: state.appCollection.map((a) =>
//         a.id === app.id ? app : a,
//       ),
//     }));
//   },
//   saveNewApp: (app) => {
//     set((state) => ({ appCollection: [...state.appCollection, app] }));
//   },
//   removeApp: (app) => {
//     set((state) => ({
//       appCollection: state.appCollection.filter((a) => a.id !== app.id),
//     }));
//   }
// });

// const initialPageStore = createStore('page')({
//   page: 0,
//   pageCount: 0,
//   pageContent: null,
//   getTotalSize: state => state.appCollection?.length,
//   pageSize: PAGE_SIZE,
//   inReverse: false,
//   filterModel: filterModel,
//   activeFilter: null,
//   filteredList: null,
// });

// const initialSelectionStore = createStore('selection')({
//   selectedApp: null,
//   selectedAppKey: null,
//   editMode: false,
// });

// const initialGlobalStore = createStore('global')({
//   isloading: false,
//   error: null,
// });

export const rootStore = createStore('root')({
  appCollection: null,
  totalCount: 0,
  setAppCollection: (apps) => {
    set({ appCollection: apps });
  },
  saveUpdatedApp: (app) => {
    set((state) => ({
      appCollection: state.appCollection.map((a) =>
        a.id === app.id ? app : a,
      ),
    }));
  },
  saveNewApp: (app) => {
    set((state) => ({ appCollection: [...state.appCollection, app] }));
  },
  removeApp: (app) => {
    set((state) => ({
      appCollection: state.appCollection.filter((a) => a.id !== app.id),
    }));
  },
  page: 0,
  pageCount: 0,
  pageContent: null,
  getTotalSize: state => state.appCollection?.length,
  pageSize: PAGE_SIZE,
  inReverse: false,
  filterModel: filterModel,
  activeFilter: null,
  filteredList: null,
  selectedApp: null,
  selectedAppKey: null,
  editMode: false,
  isLoading: false,
  error: null,
  middlewares: ['devtools']
});





// export const useAppCollectionStore = create((set) => ({
//   appCollection: [],
//   setAppCollection: (apps) => {
//     set({ appCollection: apps });
//   },
//   saveUpdatedApp: (app) => {
//     set((state) => ({
//       appCollection: state.appCollection.map((a) =>
//         a.id === app.id ? app : a,
//       ),
//     }));
//   },
//   saveNewApp: (app) => {
//     set((state) => ({ appCollection: [...state.appCollection, app] }));
//   }
// }));

// export const usePageStore = create((set) => ({
//   page: 0,
//   setPage: (page) => set({ page }),
//   pageCount: 0,
//   setPageCount: (count) => set({ pageCount: count }),
//   pageContent: null,
//   setPageContent: (content) => set({ pageContent: content }),
//   pageSize: PAGE_SIZE,
//   setPageSize: (pageSize) => set({ pageSize }),
//   inReverse: false,
//   setInReverse: (reverse) => set({ inReverse: reverse }),
//   filterModel: filterModel,
//   activeFilter: null,
//   setActiveFilter: (filter) => set({ activeFilter: filter }),
//   filteredList: null,
//   setFilteredList: (list) => set({ filteredList: list }),
// }));

// export const useSelectionStore = create((set) => ({
//   selectedApp: null,
//   setSelectedApp: (app) => set({ selectedApp: app }),
//   selectedAppKey: null,
//   setSelectedAppKey: (key) => set({ selectedAppKey: key }),
//   editMode: false,
//   setEditMode: (mode) => set({ editMode: mode }),
// }));

// export const useRootStore = create((set) => ({
//   ...appCollectionStore(),
//   ...usePageStore(),
//   ...useSelectionStore()
// }))

// export const useStore = create((set) => ({
//   allApps: [],
//   setAllApps: (apps) => {
//     set({ allApps: apps });
//   },
//   totalCount: 0,
//   setTotalCount: (total) => {
//     set({ totalCount: total });
//   },
//   limit: 20,
//   setLimit: (limit) => set({ limit }),
//   downloadGenericYaml: () => downloadGenericYaml(),
//   downloadGenericJson: () => downloadGenericJson(),
//   downloadInstallDoctorYaml: () => downloadInstallDoctorYaml(),

//   selectedApp: null,
//   setSelectedApp: (app) => {
//     set({ selectedApp: app });
//     console.log('Set selectedApp in global Zustand store');
//   },
//   selectedAppKey: null,
//   setSelectedAppKey: (key) => set({ selectedAppKey: key }),
//   closeApp: () => set({ selectedApp: null, selectedAppKey: null }),
//   editApp: (appKey) => set({
//     selectedApp: allApps[appKey],
//     selectedAppKey: appKey,
//     isEditMode: true,
//   }),
//   addItem: () => set({
//     selectedItem: null,
//     selectedItemKey: null,
//     isEditMode: true,
//     isNewApp: true,
//   }),
//   isEditMode: false,
//   setIsEditeMode: (mode) => set({ isEditMode: mode }),

//   page: 0,
//   pageCount: 0,
//   pageContent: null,
//   setPage: (page) => set({ page: page }),
//   setPageCount: (count) => set({ pageCount: count }),
//   setPageContent: (content) => {
//     set({ pageContent: content });
//     console.log('Populated pageContent in global Zustand store: ', content);
//   },

//   filterModel: filterModel,
//   filteredResult: [],
//   activeFilter: null,

//   isLoading: false,
//   setIsLoading: (isLoading) => set({ isLoading }),
//   error: null,
//   setError: (error) => set({ error }),
// }));



const queryClient = new QueryClient();
const _setListSize = (size) => setTotalCount(size);
const _setNumPages = (size) => setPageCount(Math.ceil(size / limit));

const _isNullOrEmpty = (value) => {
  return value === null || value === undefined || value === "";
};

const _appHasInstaller = (app) => {
  for (const field of appModelInstallerFields) {
    if (app && !_isNullOrEmpty(app[field])) {
      return true;
    }
  }
  return false;
};

const _isStartOfPage = (index) => {
  return index === 0;
};

const _isEndOfPage = (index) => {
  return index === pageContent.length - 1;
};

const getPage = (page) => {
  console.log(`Getting page: ${page}`);
  setIsLoading(true);
  getAppPage(page).then((apps) => {
    console.log("Got page", apps);
    setPage(page);
    setPageContent(apps);
    setIsLoading(false);
    invalidateCache();
    queryClient.setQueryData(["appPage"], apps);
  });
};

const selectApp = (appKey) => {
  setIsLoading(true);
  getApp(appKey).then((app) => {
    if (!app) {
      console.warn("Found no app with key: ", appKey);
      setIsLoading(false);
      return;
    }
    app.hasInstaller = _appHasInstaller(app);
    setSelectedApp(app);
    setSelectedAppKey(appKey);
    setIsLoading(false);
  });
};

const clearAppSelection = () => {
  setSelectedApp(null);
  setSelectedAppKey(null);
};

const editApp = (appKey) => {
  console.log("Edit");
  if (appKey) {
    console.log("Getting app...");
    setIsLoading(true);
    getApp(appKey).then((app) => {
      selectApp(appKey);
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
    setAllApps(allApps.filter((app) => app.key !== appKey));
    setPageContent(pageContent.filter((app) => app.key !== appKey));
    setIsLoading(false);
    invalidateCache();
  });
};

const updateItem = (app) => {
  setIsLoading(true);
  app.edited = true;
  updateApp(app.appKey).then(() => {
    setAllApps(...prev, app);
    setIsLoading(false);
    invalidateCache();
  });
};

const editNewItem = () => {
  console.log("Edit new item");
  clearAppSelection();
  setEditMode(true);
};

const addItem = (app) => {
  setIsLoading(true);
  addApp(app).then(() => {
    setAllApps([...prev, app]);
    if (page === pageCount.length) {
      setPageContent([...pageContent, app]);
    }
    setIsLoading(false);
    invalidateCache();
  });
};

const gotoPrev = () => {
  if (selectedAppKey && pageContent) {
    const index = _findIndex(selectedAppKey, pageContent);
    _isStartOfPage(index)
      ? gotoPrevPage()
      : selectApp(pageContent[index - 1].key);
  } else {
    Array.isArray(pageContent) && selectApp(pageContent[0].key);
  }
};

const gotoNext = () => {
  if (selectedAppKey && pageContent) {
    const index = _findIndex(selectedAppKey, pageContent);
    _isEndOfPage(index)
      ? gotoNextPage()
      : selectApp(pageContent[index + 1].key);
  } else {
    Array.isArray(pageContent) && selectApp(pageContent[0]?.key);
  }
};

const gotoPrevPage = () => {
  setInReverse(true);
  page > 1 && getPage(page - 1);
};

const gotoNextPage = () => {
  console.log(`Turning page from ${page} to ${page + 1}`);
  console.log(`PageCount ${pageCount}`);
  page < pageCount && getPage(page + 1);
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
  invalidateCache();
  queryClient.setQueryData(["appPage"], filteredeApps);
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
  invalidateCache();
  queryClient.setQueryData(["appPage"], appList);
  return appList;
};

const invalidateCache = () => {
  queryClient.invalidateQueries(["appCollection", "appPage"]);
  // queryClient.setQueryData(["appCollection"], filteredeApps);
};

export const populateList = (page = 1) => {
  console.log(`*** Populating list - viewing page ${page} ***`);
  setIsLoading(true);
  getAllApps().then((apps) => {
    setAllApps(apps);
    _setListSize(apps?.length);
    _setNumPages(apps?.length);
    setPage(page);
    getAppPage(page).then((apps) => {
      console.log("PopulateList: ", apps?.length);
      setPageContent(apps);
      selectApp(apps[0].key);
      setIsLoading(false);
      invalidateCache();
    });
  });
};

const initPagination = (page = 1) => {
  _setListSize(allApps?.length);
  _setNumPages(Math.ceil(allApps?.length / 20));
  setPage(page);
  console.table({
    page,
    totalApps,
    pageCount,
    totalCount,
  });
  if (allApps.length > 0) {
    const firstApp = allApps[0];
    firstApp.hasInstaller = _appHasInstaller(firstApp);
    selectApp(firstApp.key);
  }

  setIsLoading(false);
};

const downloadGenericYaml = () => { console.log('Not implemented...'); };
const downloadGenericJson = () => { console.log('Not implemented...'); };
const downloadInstallDoctorYaml = () => { console.log('Not implemented...'); };
