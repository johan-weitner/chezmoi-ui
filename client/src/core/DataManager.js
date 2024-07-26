import { useEffect } from "react";
import { toast } from "sonner";
import { selectPageContent, selectAppByKey } from "store/selectors";
import { rootStore } from "store/store";
import {
  getAllApps,
  deleteApp,
  updateApp,
  saveNewApp,
  getAllTags,
  addAppTags,
} from "api/appCollectionApi";
import { usePageManager } from "./PageManager";

export const useDataManager = () => {
  const { store } = rootStore;
  const state = store.getState();
  const { page, pageCount, getTotalSize } = state;
  const PAGE_SIZE = Number.parseInt(import.meta.env.VITE_PAGE_SIZE) || 20;
  const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";
  const { gotoPage, getPageContent } = usePageManager();

  const useBootstrap = () => {
    return useEffect(() => {
      if (
        rootStore.get.appCollection() &&
        rootStore.get.appCollection().length > 0
      ) {
        return;
      }
      DEBUG && console.log("--=== ClientManager: Seeding client... ===--");
      rootStore.set.isLoading(true);
      seedStore().then((apps) => {
        DEBUG &&
          console.log("ClientManager: Fetched data payload: ", apps?.length);
        const list = getPageContent();
        rootStore.set.pageContent(list);

        DEBUG &&
          console.log(`ClientManager:
						Page: ${page},
						Total: ${getTotalSize(rootStore.store.getState())},
						Count: ${pageCount}`);
        DEBUG && console.log("--=== ClientManager: Done seeding client! ===--");
        rootStore.set.isLoading(false);
      });
    }, []);
  };

  const usePageSwitch = () => {
    return useEffect(() => {
      if (!rootStore.get.appCollection()) {
        return;
      }
      rootStore.set.isLoading(true);
      const newPage = getPageContent();
      rootStore.set.pageContent(newPage);

      rootStore.set.isLoading(false);
    }, [rootStore.use.page()]);
  };

  const seedStore = async () => {
    const apps = await getAllApps()
      .then((apps) => {
        const totalCount = apps?.length || 0;
        const pageCount = apps && Math.ceil(apps.length / PAGE_SIZE);
        rootStore.set.appCollection(apps);
        rootStore.set.totalCount(totalCount);
        rootStore.set.pageCount(pageCount);
        rootStore.set.page(1);

        DEBUG &&
          console.log(
            `ClientManager: Seeding app collection: Got ${apps?.length} apps`,
          );
        DEBUG &&
          console.log(`ClientManager:
						totalCount: ${totalCount},
						pageCount: ${pageCount},
						PAGE_SIZE: ${PAGE_SIZE}`);

        DEBUG &&
          console.log(`ClientManager: Populated global state:
						appCollection: ${rootStore.get.appCollection()?.length}
						totalCount: ${rootStore.get.totalCount()}
						pageCount: ${rootStore.get.pageCount()}
						page: ${rootStore.get.page()}`);
      })
      .catch((err) => {
        toast.error("Error fetching app collection: ", err);
      });

    getAllTags().then((tags) => {
      rootStore.set.allowedTags(tags);
    });

    return openFirstPage();
  };

  const openFirstPage = () => {
    const apps = selectPageContent(state);
    gotoPage(1);
    rootStore.set.selectedAppKey(apps[0]?.key);
    rootStore.set.pageContent(apps);
    return apps;
  };

  const refreshAppCollection = () => {
    getAllApps().then((apps) => {
      rootStore.set.appCollection(apps);
      rootStore.set.pageCount(
        Math.ceil(apps.length / rootStore.get.pageSize()),
      );
    });
  };

  const deleteItem = (appKey) => {
    const apps = rootStore.get.appCollection();
    const pageContent = rootStore.get.pageContent();
    rootStore.set.isLoading(true);
    deleteApp(appKey)
      .then(() => {
        const newList = apps.filter((app) => app.key !== appKey);
        const newPage = pageContent.filter((app) => app.key !== appKey);
        rootStore.set.appCollection(newList);
        rootStore.set.pageContent(newPage);
        rootStore.set.isLoading(false);
        toast.success("App deleted successfully");
      })
      .catch((err) => {
        console.error("ClientManager: Error deleting app: ", err);
        toast.error("Error deleting app");
      });
  };

  const updateItem = (app, appTags) => {
    const appKey = app.key;
    DEBUG &&
      console.log(`ClientManager: Updating app:
			- Tags: ${app.tags}`);
    setIsLoading(true);
    console.log("Saving tags for app with id: ", app.id);
    tagApp(Number.parseInt(app.id, 10), appTags)
      .then((res) => {
        console.log("Tagged app: ", res);
      })
      .catch((e) => {
        console.error(e);
      });
    const apps = rootStore.get.appCollection();
    updateApp(app)
      .then(() => {
        rootStore.set.appCollection([
          ...apps,
          {
            ...app,
            edited: "true",
          },
        ]);

        const index = apps.findIndex((item) => item.key === app.key);
        apps[index] = app;
        rootStore.set.appCollection(apps);
        gotoPage(rootStore.get.page());
        setIsLoading(false);

        if (DEBUG) {
          const updatedApp = selectAppByKey(appKey);
          console.log(`ClientManager: Updated app in store:
						- Tags: ${updatedApp.tags}`);
        }

        toast.success("App updated successfully");
      })
      .catch((err) => {
        console.error("ClientManager: Error updating app: ", err);
        toast.error("Error updating app");
      });
  };

  const saveNewItem = (app, tagIds) => {
    setIsLoading(true);
    const apps = rootStore.get.appCollection();
    const pageContent = rootStore.get.pageContent();
    saveNewApp(app)
      .then((newApp) => {
        console.log("!!! Saved new app with id: ", newApp?.id);
        tagApp(newApp?.id, tagIds);
        rootStore.set.appCollection([...apps, app]);
        if (page === pageCount.length) {
          rootStore.set.pageContent([...pageContent, app]);
        }
        setIsLoading(false);
        toast.success("App successfully added");
      })
      .catch((err) => {
        console.error("ClientManager: Error saving new app: ", err);
        toast.error("Error saving new app");
      });
  };

  const tagApp = async (appId, tagIds) => {
    console.log("<<< Tags: ", tagIds);
    rootStore.set.isLoading(true);
    await addAppTags(appId, tagIds)
      .then(() => {
        rootStore.set.isLoading(false);
        toast.success("Tags added");
      })
      .catch((err) => {
        rootStore.set.isLoading(false);
        console.log("ClientManager: Error adding tag: ", err);
        // toast.error("Error adding tag");
      });
  };

  const downloadYaml = () => {
    console.log('Downloading YAML...');
  };

  const setIsLoading = (flag) => {
    rootStore.set.isLoading(flag);
  };

  const setIsEditMode = (flag) => {
    rootStore.set.editMode(flag);
  };

  return {
    useBootstrap,
    usePageSwitch,
    seedStore,
    openFirstPage,
    refreshAppCollection,
    updateItem,
    deleteItem,
    saveNewItem,
    tagApp,
    setIsLoading,
    setIsEditMode,
    downloadYaml
  };
};
