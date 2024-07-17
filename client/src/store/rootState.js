import { create } from 'zustand'

export const useStore = create((set) => ({
  data: {
    allApps: [],
    setAllApps: (apps) => set({ data: { allApps: apps } }),
    saveUpdatedItem: (key) => saveUpdatedItem(key),
    saveNewItem: (key) => saveNewItem(key),
    deleteItem: (key) => deleteItem(key),
    downloadGenericYaml: () => downloadGenericYaml(),
    downloadGenericJson: () => downloadGenericJson(),
    downloadInstallDoctorYaml: () => downloadInstallDoctorYaml(),
  },
  view: {
    mode: "default",
    setMode: (mode) => set({ view: { mode } }),
    selectedItem: null,
    setSelectedApp: (selectedItem) => set({ view: { selectedItem } }),
    selectedItemKey: null,
    setSelectedAppKey: (selectedItemKey) => set({ view: { selectedItemKey } }),
    detailView: {
      isOpen: false,
      setIsOpen: (isOpen) => set({ detailView: { isOpen } }),
      fallback: Legend,
    },
    editView: {
      isOpen: false,
      setIsOpen: (isOpen) => set({ editView: { isOpen } }),
      isNewApp: false,
      setIsNewApp: (isNewApp) => set({ editView: { isNewApp } }),
    },

    selectItem: (app) => { set({ selectedItem: app, selectedItemKey: app.key }); },
    closeItem: () => set({ selectedItem: null, selectedItemKey: null }),
    editItem: (appKey) => set({
      selectedItem: allApps[appKey],
      selectedItemKey: appKey,
      editView: { isOpen: true, isNewApp: false }
    }),
    addItem: () => set({
      selectedItem: null,
      selectedItemKey: null,
      editView: { isOpen: true, isNewApp: true },
    }),
    isEditMode: false,
    setIsEditeMode: (mode) => set({ isEditMode: mode }),
  },
  pageManager: {
    currentPage: 0,
    pageCount: 0,
    getPage: (page) => getPage(page),
    setPage: (page) => set({ currentPage: page }),
    setPageCount: (count) => set({ pageCount: count }),
    prevApp: () => prevApp(),
    nextApp: () => nextApp(),
    prevPage: () => prevPage(),
    nextPage: () => nextPage(),
  },
  filterManager: {
    filterModel: {
      noInstallers: {
        key: "noInstallers",
        method: filterNoInstallerApps,
        title: "Apps without installers",
      },
      noUrls: {
        key: "noUrls",
        method: filterNoUrlsApps,
        title: "Apps without URLs",
      },
      noDesc: {
        key: "noDesc",
        method: filterNoDescsApps,
        title: "Apps without name",
      },
      noName: {
        key: "noName",
        method: filterNoNamesApps,
        title: "Apps without description",
      },
    },
    filteredResult: [],
    activeFilter: null,
    applyFilter: (filter) => applyFilter(filter),
    clearFilter: () => set({ filterManager: { activeFilter: null } }),
  },
}));






const queryClient = useQueryClient();
// const queryClient = new QueryClient();
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

const editItem = (appKey) => {
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

const populateList = (page = 1) => {
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

/*
const providerModel = {
  data: {
    allApps: [],
    filteredResult: [],
    setAllApps: null,
    saveOrUpdateItem: null,
    deleteItem: null,
    downloadGenericYaml: null,
    downloadGenericJson: null,
    downloadInstallDoctorYaml: null,
  },
  view: {
    mode: "default",
    selectedItem: null,
    selectedItemKey: null,
    detailView: {
      isOpen: false,
      fallback: Legend,
    },
    editView: {
      isOpen: false,
    },
    pageManager: {
      currentPage: null,
      pageCount: 0,
      prevApp: null,
      nextApp: null,
      prevPage: null,
      nextPage: null,
    },
    filterManager: {
      filters: [],
      activeFilter: null,
      applyFilter: null,
      clearFilter: null,
    },
    selectItem: null,
    closeItem: null,
    editItem: null,
    addItem: null,
    openSpotlightSearch: null,
  },
};
*/