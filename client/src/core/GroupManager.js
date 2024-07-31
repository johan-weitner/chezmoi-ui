import {
  fetchAppGroups, fetchAppsInGroup, addAppToGroup, removeAppFromGroup
} from "api/appCollectionApi";
import { toast } from "sonner";
import { rootStore } from "store/store";

const DEBUG = true;

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
    rootStore.set.isLoading(true);
    await fetchAppsInGroup(groupId)
      .then((data) => {
        rootStore.set.isLoading(false);
        console.log("Response: ", data.apps);
        const apps = Object.values(data.apps).map(item => { return item.application });
        rootStore.set.appsInSelectedGroup(Object.values(apps));
        console.log("Setting apps in group: ", rootStore.get.appsInSelectedGroup());
      })
      .catch((err) => {
        rootStore.set.isLoading(false);
        rootStore.set.error(err);
        toast.error(err?.message);
        console.log("GroupManager: Error fetching apps in group: ", err);
      });
  };

  const putAppInGroup = async (groupId, appId) => {
    console.log("GroupManager: Adding app to group: ", groupId, appId);
    if (!groupId || !appId) {
      return;
    }
    rootStore.set.isLoading(true);
    await addAppToGroup(groupId, appId)
      .then(() => {
        rootStore.set.isLoading(false);
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
      })
      .catch((err) => {
        rootStore.set.isLoading(false);
        rootStore.set.error(err);
        toast.error(err);
        console.log("GroupManager: Error removing app from group: ", err);
      });
  };

  return { seedGroups, getAppsInGroup, putAppInGroup, kickAppFromGroup };
};

