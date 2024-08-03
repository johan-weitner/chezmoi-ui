import {
  fetchAppGroups, fetchAppsInGroup, addAppToGroup, removeAppFromGroup, fetchGroupApps
} from "api/appCollectionApi";
import { toast } from "sonner";
import { getAppById, getSelectedGroupId } from "store/selectors";
import { useSelector, useDispatch } from "react-redux";
import {
  rootStore,
  getState,
  store,
  setAppsInSelectedGroup,
  setSelectedAppGroups,
  setSelectedGroup,
  setIsLoading,
  setError,
  setSelectedGroupKey,
  setAppGroups,
  setAppGroupKeys
} from "store/store";

export const useGroupManager = () => {
  const { dispatch } = store;

  const toggleIsLoading = (isLoading) => {
    dispatch(setIsLoading(isLoading));
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
        console.error("GroupManager: Error fetching groups: ", err);
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
    const groups = await fetchGroupApps(appId)
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
        console.log("GroupManager: Groups for app: ", groupArr);
        dispatch(setSelectedAppGroups(groupArr));
        return groupArr;
      })
      .catch((err) => {
        toggleIsLoading(false);
        dispatch(setError(err));
        toast.error(err?.message);
        console.error("GroupManager: Error fetching app's group memberships: ", err);
      });
    return groups;
  };

  const putAppInGroup = async (groupId, appId) => {
    if (!groupId || !appId) {
      return;
    }
    toggleIsLoading(true);
    await addAppToGroup(groupId, appId)
      .then((newApp) => {
        toggleIsLoading(false);
        const apps = getState().appsInSelectedGroup || [];
        if (newApp?.application?.name) {
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
        const apps = getState().appsInSelectedGroup || [];
        const newApps = apps?.filter(app => app.id !== appId);
        dispatch(setAppsInSelectedGroup(newApps));
        const groups = getState().selectedAppGroups;
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
    const groupKeys = getState().appGroupKeys;
    const currentIndex = groupKeys.indexOf(
      getState().selectedGroupKey);
    if (currentIndex === 0) {
      return;
    }

    rootStore.set.selectedGroupKey(groupKeys[currentIndex - 1]);
    dispatch(setSelectedGroup(groupKeys[currentIndex - 1]));

    getAppsInGroup(getSelectedGroupId());
  };

  const gotoNextGroup = () => {
    const groupKeys = getState().appGroupKeys;
    const currentIndex = groupKeys.indexOf(
      getState().selectedGroupKey);
    if (currentIndex === groupKeys.length - 1) {
      return;
    }
    dispatch(setSelectedGroupKey(groupKeys[currentIndex + 1]));
    getAppsInGroup(getSelectedGroupId());
  };

  return {
    seedGroups,
    getAppsInGroup,
    putAppInGroup,
    kickAppFromGroup,
    gotoPrevGroup,
    gotoNextGroup,
    getGroupsByApp,
    removeAllGroupRelations
  };
};
