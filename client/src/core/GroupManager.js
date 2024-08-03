import {
  fetchAppGroups, fetchAppsInGroup, addAppToGroup, removeAppFromGroup, fetchGroupApps
} from "api/appCollectionApi";
import { toast } from "sonner";
import { getAppById, getSelectedGroupId } from "store/selectors";
import { useSelector, useDispatch } from "react-redux";
import {
  rootStore,
  setAppsInSelectedGroup,
  setSelectedAppGroups,
  setSelectedGroup,
  setIsLoading,
  setError,
} from "store/store";

const DEBUG = import.meta.env.VITE_DEBUG === "true";

export const useGroupManager = () => {
  const dispatch = useDispatch();

  const toggleIsLoading = (isLoading) => {
    dispatch(toggleIsLoading(isLoading));
  };

  const seedGroups = async () => {
    await fetchAppGroups()
      .then((groups) => {
        const groupsArray = Object.values(groups);
        if (!groupsArray) {
          return;
        }
        dispatch(setAppGroups(groupsArray));
        const groupKeys = groupsArray.map(group => { return group.name; });
        dispatch(setAppGroupKeys(groupKeys));
      })
      .catch((err) => {
        toast.error("Error fetching groups: ", err);
      });
  };

  const getAppsInGroup = async (groupId) => {
    if (!groupId) return;
    toggleIsLoading(true);
    await fetchAppsInGroup(groupId)
      .then((data) => {
        toggleIsLoading(false);
        if (!data) throw new Error(`No data returned for group: ${groupId}`);
        const apps = Object.values(data.apps).map(item => { return item.application });
        dispatch(setAppsInSelectedGroup(Object.values(apps)));
      })
      .catch((err) => {
        toggleIsLoading(false);
        dispatch(setError(err));
        toast.error(err?.message);
        console.error("GroupManager: Error fetching apps in group: ", err);
      });
  };

  const getGroupsByApp = async (appId) => {
    if (!appId) return;
    toggleIsLoading(true);
    await fetchGroupApps(appId)
      .then((res) => {
        toggleIsLoading(false);
        const { data } = res;
        const groups = data.groups;
        const groupArr = groups?.map(group => {
          return {
            id: group.groupId,
            name: group.group.name,
          };
        });
        dispatch(setSelectedAppGroups(groupArr));
        return groupArr;
      })
      .catch((err) => {
        toggleIsLoading(false);
        dispatch(setError(err));
        toast.error(err?.message);
        console.error("GroupManager: Error fetching app's group memberships: ", err);
      });
  };

  const putAppInGroup = async (groupId, appId) => {
    if (!groupId || !appId) {
      return;
    }
    rootStore.set.isLoading(true);
    await addAppToGroup(groupId, appId)
      .then((newApp) => {
        toggleIsLoading(false);
        const apps = useSelector((state) => state.root.appsInSelectedGroup) || [];
        if (newApp?.application?.name) {
          rootStore.set.appsInSelectedGroup([...apps, newApp.application]);
          dispatch(setAppsInSelectedGroup([...apps, newApp.application]));
        }
        toast.success("Added app to the group");
      })
      .catch((err) => {
        toggleIsLoading(false);
        dispatch(setError(err));
        toast.error(err);
        console.log("GroupManager: Error adding app to group: ", err);
      });
  };

  const kickAppFromGroup = async (groupId, appId) => {
    toggleIsLoading(true);
    await removeAppFromGroup(groupId, appId)
      .then(() => {
        toggleIsLoading(false);
        const apps = useSelector((state) => state.root.appsInSelectedGroup) || [];
        const newApps = apps?.filter(app => app.id !== appId);
        dispatch(setAppsInSelectedGroup(newApps));
        const groups = useSelector((state) => state.root.selectedAppGroups);
        const newGroups = groups?.filter(group => group.id !== groupId);
        dispatch(setSelectedAppGroups(newGroups));
      })
      .catch((err) => {
        toggleIsLoading(false);
        dispatch(setError(err));
        toast.error(err);
        console.log("GroupManager: Error removing app from group: ", err);
      });
  };

  const removeAllGroupRelations = async (groupIds, appId) => {
    toggleIsLoading(true);
    const promises = groupIds.map(groupId => {
      return kickAppFromGroup(groupId, appId);
    });

    await Promise.all(promises)
      .then(() => {
        toggleIsLoading(false);
        toast.success("Removed app from all groups");
      })
      .catch((err) => {
        toggleIsLoading(false);
        dispatch(setError(err));
        toast.error(err);
        console.log("GroupManager: Error removing app from group: ", err);
      });
  };

  const gotoPrevGroup = () => {
    const groupKeys = useSelector((state) => state.root.appGroupKeys);
    const currentIndex = groupKeys.indexOf(
      useSelector((state) => state.root.selectedGroupKey));
    if (currentIndex === 0) {
      return;
    }

    rootStore.set.selectedGroupKey(groupKeys[currentIndex - 1]);
    dispatch(setSelectedGroup(groupKeys[currentIndex - 1]));

    getAppsInGroup(getSelectedGroupId());
  };

  const gotoNextGroup = () => {
    const groupKeys = useSelector((state) => state.root.appGroupKeys);
    const currentIndex = groupKeys.indexOf(
      useSelector((state) => state.root.selectedGroupKey));
    if (currentIndex === groupKeys.length - 1) {
      return;
    }
    dispatch(setSelectedGroupKey(groupKeys[currentIndex + 1]));
    getAppsInGroup(getSelectedGroupId());
  };

  return { seedGroups, getAppsInGroup, putAppInGroup, kickAppFromGroup, gotoPrevGroup, gotoNextGroup, getGroupsByApp, removeAllGroupRelations };
};

