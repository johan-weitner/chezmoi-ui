import { rootStore } from "store/store";
import { filterModel } from "api/filters";

export const useFilterManager = () => {
  const { store } = rootStore;
  const state = store.getState();
  const { page, pageCount, getTotalSize } = state;
  const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE) || 20;
  const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";

  const applyFilter = (filter) => {
    DEBUG && console.log(`ClientManager: Apply filter: ${filter}`);
    rootStore.set.activeFilter(filter);
    const filteredApps = filterModel[filter].method();
    rootStore.set.filteredList(filteredApps);
  };

  const clearFilter = () => {
    rootStore.set.activeFilter(null);
    rootStore.set.filteredList(null);
  };

  return { applyFilter, clearFilter };
};
