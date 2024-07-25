import { selectPageContent } from "store/selectors";
import { rootStore } from "store/store";

export const useListManager = () => {
  const { store } = rootStore;
  const state = store.getState();

  const gotoPage = (page) => {
    rootStore.set.page(page);
    const apps = selectPageContent(state);
    rootStore.set.pageContent(apps);
    return apps;
  };

  const getPageContent = () => {
    const apps = selectPageContent();
    rootStore.set.pageContent(apps);
    return apps;
  };

  const gotoPrevPage = () => {
    const page = rootStore.get.page();
    if (page > 0) {
      rootStore.set.page(page - 1);
      getPageContent();
    }
  };
  const gotoNextPage = () => {
    const page = rootStore.get.page();
    const pageCount = rootStore.get.pageCount();
    if (page < pageCount - 1) {
      rootStore.set.page(page + 1);
      getPageContent();
    }
  };

  return { gotoPage, getPageContent, gotoPrevPage, gotoNextPage };
};
