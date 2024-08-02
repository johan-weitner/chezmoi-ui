import {
  fetchAppGroups, fetchAppsInGroup, addAppToGroup, removeAppFromGroup, fetchGroupApps
} from "api/appCollectionApi";
import { toast } from "sonner";
import { rootStore } from "store/store";
import { getAppById, getSelectedGroupId } from "store/selectors";

const DEBUG = import.meta.env.VITE_DEBUG === "true";

export const useGroupManager = () => {

  const seedGroups = async () => {
    await fetchAppGroups()
      .then((groups) => {
        const groupsArray = Object.values(groups);

        if (!groupsArray) {
          return;
        }
        rootStore.set.appGroups(groupsArray);
        const groupKeys = groupsArray.map(group => { return group.name; });
        rootStore.set.appGroupKeys(groupKeys);

        DEBUG &&
          console.log(
            `GroupManager: Seeding groups: Got ${groupsArray?.length} groups`,
          );

        DEBUG &&
          console.log(`GroupManager: Populated global state:
						Groups: ${rootStore.get.appGroups()?.length}
						Group keys: ${rootStore.get.appGroupKeys()?.length}`);
      })
      .catch((err) => {
        toast.error("Error fetching groups: ", err);
      });
  };

  const getAppsInGroup = async (groupId) => {
    if (!groupId) return;
    rootStore.set.isLoading(true);
    await fetchAppsInGroup(groupId)
      .then((data) => {
        rootStore.set.isLoading(false);
        if (!data) throw new Error(`No data returned for group: ${groupId}`);
        const apps = Object.values(data.apps).map(item => { return item.application });
        rootStore.set.appsInSelectedGroup(Object.values(apps));
      })
      .catch((err) => {
        rootStore.set.isLoading(false);
        rootStore.set.error(err);
        toast.error(err?.message);
        console.error("GroupManager: Error fetching apps in group: ", err);
      });
  };








  const getGroupsByApp = async (appId) => {
    if (!appId) return;
    rootStore.set.isLoading(true);
    await fetchGroupApps(appId)
      .then((res) => {
        rootStore.set.isLoading(false);
        const { data } = res;
        const groups = data.groups;
        console.log("GroupManager: Got groups by app: ", groups, Array.isArray(groups));
        const groupArr = groups?.map(group => {
          return {
            id: group.groupId,
            name: group.group.name,
          };
        });
        console.log("Group arr: ", groupArr);
        rootStore.set.selectedAppGroups(groupArr);
        return groupArr;
      })
      .catch((err) => {
        rootStore.set.isLoading(false);
        rootStore.set.error(err);
        toast.error(err?.message);
        console.error("GroupManager: Error fetching app's group memberships: ", err);
      });
  };









  const putAppInGroup = async (groupId, appId) => {
    console.log("GroupManager: Adding app to group: ", groupId, appId);
    if (!groupId || !appId) {
      return;
    }
    rootStore.set.isLoading(true);
    await addAppToGroup(groupId, appId)
      .then((newApp) => {
        rootStore.set.isLoading(false);
        const apps = rootStore.get.appsInSelectedGroup() || [];
        if (newApp?.application?.name) {
          rootStore.set.appsInSelectedGroup([...apps, newApp.application]);
        }
        toast.success("Added app to the group");
      })
      .catch((err) => {
        rootStore.set.isLoading(false);
        rootStore.set.error(err);
        toast.error(err);
        console.log("GroupManager: Error adding app to group: ", err);
      });
  };

  const kickAppFromGroup = async (groupId, appId) => {
    rootStore.set.isLoading(true);
    await removeAppFromGroup(groupId, appId)
      .then(() => {
        rootStore.set.isLoading(false);
        const apps = rootStore.get.appsInSelectedGroup();
        const newApps = apps?.filter(app => app.id !== appId);
        rootStore.set.appsInSelectedGroup(newApps);
        const groups = rootStore.get.selectedAppGroups();
        const newGroups = groups?.filter(group => group.id !== groupId);
        rootStore.set.selectedAppGroups(newGroups);
      })
      .catch((err) => {
        rootStore.set.isLoading(false);
        rootStore.set.error(err);
        toast.error(err);
        console.log("GroupManager: Error removing app from group: ", err);
      });
  };

  const removeAllGroupRelations = async (groupIds, appId) => {
    rootStore.set.isLoading(true);
    const promises = groupIds.map(groupId => {
      return kickAppFromGroup(groupId, appId);
    });

    await Promise.all(promises)
      .then(() => {
        rootStore.set.isLoading(false);
        toast.success("Removed app from all groups");
      })
      .catch((err) => {
        rootStore.set.isLoading(false);
        rootStore.set.error(err);
        toast.error(err);
        console.log("GroupManager: Error removing app from group: ", err);
      });
  };

  const gotoPrevGroup = () => {
    const groupKeys = rootStore.get.appGroupKeys();
    const currentIndex = groupKeys.indexOf(rootStore.get.selectedGroupKey());
    if (currentIndex === 0) {
      return;
    }

    rootStore.set.selectedGroupKey(groupKeys[currentIndex - 1]);
    // rootStore.set.selectedGroup(groups[currentIndex - 1]);

    getAppsInGroup(getSelectedGroupId());
  };

  const gotoNextGroup = () => {
    const groupKeys = rootStore.get.appGroupKeys();
    const currentIndex = groupKeys.indexOf(rootStore.get.selectedGroupKey());
    if (currentIndex === groupKeys.length - 1) {
      return;
    }
    rootStore.set.selectedGroupKey(groupKeys[currentIndex + 1]);
    // rootStore.set.selectedGroup(rootStore.get.appGroups[currentIndex + 1]);
    getAppsInGroup(getSelectedGroupId());
  };

  return { seedGroups, getAppsInGroup, putAppInGroup, kickAppFromGroup, gotoPrevGroup, gotoNextGroup, getGroupsByApp, removeAllGroupRelations };
};

