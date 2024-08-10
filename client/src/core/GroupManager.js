import {
  fetchAppGroups,
  fetchAppsInGroup,
  addAppToGroup,
  removeAppFromGroup
} from "api/fetchApi";
import { toast } from "sonner";
import {
  getState,
  store,
  setAppsInSelectedGroup,
  setSelectedGroup,
  setSelectedGroupId,
  setIsLoading,
  setError,
  setAppGroups
} from "store/store";
import { log } from 'utils/logger';

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
      })
      .catch((err) => {
        log.error("GroupManager: Error fetching groups: ", err);
        toast.error("Error fetching groups: ", err);
      });
  };

  const selectGroup = (groupId) => {
    const group = getGroupById(groupId)
    dispatch(setSelectedGroupId(groupId));
    fetchAppsInGroup(groupId).then(data => {
      dispatch(setSelectedGroup({ ...group, Application: data.apps }));
    });
  };

  const getGroupId = (groupName) => {
    const found = getState().appGroups.find((item) => item.name === groupName);
    return found ? found.id : -1;
  };

  const getGroupById = (groupId) => {
    if (!groupId) return;
    return getState().appGroups.find((group) => group.id === groupId);
  };

  const getGroupsByApp = async (appId) => {
    if (!appId) return;
    return getState().selectedApp.appGroups;
  };

  const putAppInGroup = async (groupId, appId) => {
    if (!groupId || !appId) {
      return;
    }
    toggleIsLoading(true);
    await addAppToGroup(groupId, appId)
      .then((newApp) => {
        toggleIsLoading(false);
        const apps = getState().selectedGroup.Application || [];
        if (newApp?.application?.name) {
          dispatch(setAppsInSelectedGroup([...apps, newApp.application]));
        }
        toast.success("Added app to the group");
      })
      .catch((err) => {
        toggleIsLoading(false);
        dispatch(setError(err));
        toast.error(err);
        log.debug("GroupManager: Error adding app to group: ", err.response.data);
      });
  };

  const dropAppFromGroup = async (groupId, appId) => {
    toggleIsLoading(true);
    log.debug("Removing app from group: ", groupId, appId);
    await removeAppFromGroup(groupId, appId)
      .then((updatedGroup) => {
        toggleIsLoading(false);
        log.debug("Removed app from group: ", updatedGroup);
        dispatch(setSelectedGroup(updatedGroup));
      })
      .catch((err) => {
        toggleIsLoading(false);
        dispatch(setError(err));
        toast.error(err);
        log.debug("GroupManager: Error removing app from group: ", err);
      });
  };

  const removeAllGroupRelations = async (groupIds, appId) => {
    toggleIsLoading(true);
    const promises = groupIds.map(groupId => {
      return dropAppFromGroup(groupId, appId);
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
        log.debug("GroupManager: Error removing app from group: ", err);
      });
  };

  const gotoPrevGroup = () => {
    const groups = getState().appGroups;
    const found = groups.find((group) => group.id === getState().selectedGroup.id);
    const currentIndex = groups.indexOf(found);
    if (currentIndex === 0) {
      return;
    }
    const newId = groups[currentIndex - 1]?.id;
    selectGroup(newId);
  };

  const gotoNextGroup = () => {
    const groups = getState().appGroups;
    const found = groups.find((group) => group.id === getState().selectedGroup.id);
    const currentIndex = groups.indexOf(found);
    if (currentIndex === groups.length - 1) {
      return;
    }
    const newId = groups[currentIndex + 1]?.id;
    selectGroup(newId);
  };

  return {
    seedGroups,
    getGroupId,
    selectGroup,
    putAppInGroup,
    dropAppFromGroup,
    gotoPrevGroup,
    gotoNextGroup,
    getGroupsByApp,
    removeAllGroupRelations,
    getGroupById
  };
};
