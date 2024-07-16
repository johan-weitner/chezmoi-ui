export const clientModel = {
  data: {
    allApps: [], // Array<Object>
    filteredResult: [], // Array<Object>
    setAllApps: null, // function: @arg apps {Array<Object>}
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
};