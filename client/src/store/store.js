import { createStore } from 'zustand-x'
import { filterModel } from "api/filters";

export const useStore = () => { };

const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE, 10);



export const rootStore = createStore('root')({
  appCollection: null,
  totalCount: 0,
  page: 0,
  pageCount: 0,
  pageContent: null,
  getTotalSize: (state) => state.appCollection?.length || 0,
  pageSize: PAGE_SIZE,
  inReverse: false,
  filterModel: filterModel,
  activeFilter: null,
  filteredList: null,
  selectedApp: null,
  selectedAppKey: null,
  editMode: false,
  isNewApp: false,
  isLoading: false,
  error: null,
  middlewares: ['devtools']
});

const getState = () => {
  return rootStore.store.getState();
};

const downloadGenericYaml = () => { console.log('Not implemented...'); };
const downloadGenericJson = () => { console.log('Not implemented...'); };
const downloadInstallDoctorYaml = () => { console.log('Not implemented...'); };
