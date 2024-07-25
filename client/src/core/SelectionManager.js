import { toast } from "sonner";
import { getPreviousKey, getNextKey, selectAppByKey } from "store/selectors";
import { rootStore } from "store/store";
import { fetchApp, getTagsByAppId } from "api/appCollectionApi";
import { transformNullValues } from "../api/helpers";

export const useSelectionManager = () => {
  const { store } = rootStore;
  const state = store.getState();
  const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";

  const setSelectedAppKey = (key) => {
    console.log("Selected app key: ", key);
    rootStore.set.selectedAppKey(key);
    rootStore.set.isLoading(true);
    if (key === null) return;
    const app = fetchApp(key)
      .then((app) => {
        rootStore.set.isLoading(false);
        rootStore.set.selectedApp(app);

        getAppTags(app.id)
          .then((tags) => {
            rootStore.set.selectedAppTags(tags);
          })
          .catch((err) => {
            console.error(err);
            toast.error("Error fetching tags");
          });

        true &&
          console.log(
            `ClientManager: Set app object in store:
					- Key: ${rootStore.get.selectedApp()?.key}
					- Tags: ${rootStore.set.selectedAppTags()}`,
          );
      })
      .catch((err) => {
        toast.error("Error fetching app: ", err);
      });
  };

  const _isFirstOnPage = (appKey) => {
    const pageContent = rootStore.get.pageContent();
    return appKey === pageContent[0]?.key;
  };

  const _isLastOnPage = (appKey) => {
    const pageContent = rootStore.get.pageContent();
    return appKey === pageContent[pageContent?.length - 1]?.key;
  };

  const selectPrevApp = () => {
    const currentKey = rootStore.get.selectedAppKey();
    const prevKey = getPreviousKey(state);
    const prevApp = selectAppByKey(prevKey);
    rootStore.set.selectedApp(prevApp);
    rootStore.set.selectedAppKey(prevKey);
    if (_isFirstOnPage(currentKey)) {
      rootStore.set.inReverse(true);
      gotoPrevPage();
    }
  };

  const selectNextApp = () => {
    const currentKey = rootStore.get.selectedAppKey();
    const nextKey = getNextKey(state);
    const nextApp = selectAppByKey(nextKey);
    rootStore.set.selectedApp(nextApp);
    rootStore.set.selectedAppKey(nextKey);
    rootStore.set.inReverse(false);
    _isLastOnPage(currentKey) && gotoNextPage();
  };

  const editItem = (appKey) => {
    DEBUG && console.log(`ClientManager: Editing app with key: ${appKey}`);
    if (appKey) {
      const app = selectAppByKey(appKey);
      rootStore.set.selectedApp(transformNullValues({ ...app }));
      rootStore.set.selectedAppKey(appKey);
      rootStore.set.isNewApp(false);
    }
    rootStore.set.editMode(true);
    DEBUG &&
      console.log(`ClientManager:
			- Edit flag set: ${rootStore.get.editMode()}
			- isNewApp flag set: ${rootStore.get.isNewApp()}`);
  };

  const getAppTags = async (appId) => {
    const tags = await getTagsByAppId(appId);
    console.log("ClientManager got tags for app: ", tags);
    return tags;
  };

  const addItem = () => {
    DEBUG && console.log("Adding new item");
    rootStore.set.selectedApp(null);
    rootStore.set.selectedAppKey(null);
    rootStore.set.isNewApp(true);
    rootStore.set.editMode(true);
    DEBUG &&
      console.log(`ClientManager:
				- Edit flag set: ${rootStore.get.editMode()}
				- isNewApp flag set: ${rootStore.get.isNewApp() === null}
				- Emptied app selection: ${rootStore.get.selectedAppKey() === null}`);
  };

  return {
    setSelectedAppKey,
    selectPrevApp,
    selectNextApp,
    editItem,
    getAppTags,
    addItem,
  };
};
