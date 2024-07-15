import Legend from 'components/DetailView/Legend';

class ClientContext {
  constructor(appName, appVersion, data, view, actions) {
    this.appName = appName;
    this.appVersion = appVersion;
    this.data = data;
    this.view = view;
    this.actions = actions;
  }
}



const clientContext = {
  appName: "Chezmoi UI",
  appVersion: "1.0",
  data: {
    allApps: [],
    pageManager: {
      currentPage: null,
      pageCount: 0,
    },
    filterManager: {
      filters: [],
      activeFilter: null,
    },
    setAllApps: null,
  },
  view: {
    mode: "default",
    detailView: {
      isOpen: false,
      currentItem: null,
      fallback: Legend,
    },
    editView: {
      isOpen: false,
      currentItem: null,
    },
  },
  actions: {
    prevApp: null,
    nextApp: null,
    prevPage: null,
    nextPage: null,
    selectItem: null,
    closeItem: null,
    editItem: null,
    addItem: null,
    applyFilter: null,
    clearFilter: null,
    updateItem: null,
    deleteItem: null,
    openSpotlightSearch: null,
    downloadGenericYaml: null,
    downloadGenericJson: null,
    downloadInstallDoctorYaml: null,
    test: () => {
      console.log("Called clientContext.actions.test()");
      console.log("This = ", this);
    },
  },
};


const pageManager = (pageCount = 1, currentPage = 1) => {
  return {
    currentPage,
    pageCount,
  };
};

const filterManager = (filters = [], activeFilter = null) => {
  return {
    filters,
    activeFilter,
  };
};

const detailView = (isOpen = false, currentItem = null, fallback = Legend) => {
  return {
    isOpen,
    currentItem,
    fallback,
  };
};

const editView = (isOpen = false, currentItem = null) => {
  return {
    isOpen,
    currentItem,
  };
};
export const clientCtx = new ClientContext(clientContext.appName, clientContext.appVersion, null, null, clientContext.actions);
export default clientContext;

