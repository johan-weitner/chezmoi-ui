import { create } from 'zustand'

export const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),

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
      isNewApp: false
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
    openSpotlightSearch: null,
    isEditMode: false
  },
  pageManager: {
    currentPage: 0,
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
}));

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