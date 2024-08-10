import axios from "axios";
import { processMetaGroups, testProcessMetaGroups } from "utils/groupUtils";
import {
  store,
  setSelectedGroup
} from "store/store";
import { log } from 'utils/logger';

const { dispatch } = store;
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const DEBUG = import.meta.env.VITE_DEBNUG === "true";

export const fetchAppGroups = async () => {
  const apps = await axios
    .get(`${BASE_URL}/groups`)
    .then((response) => {
      const { data } = response;
      const processedData = data?.groups && processMetaGroups(data.groups);
      return { ...processedData };
    })
    .catch((error) => {
      throw error;
    });
  return apps;
};

// FIXME: Replace with fetchGroup method with JOIN on Application table
export const fetchAppsInGroup = async (groupId) => {
  if (!groupId) return;
  const apps = await axios
    .get(`${BASE_URL}/group-apps?groupId=${groupId}`)
    .then((response) => {
      const { data } = response;
      testProcessMetaGroups();
      const processedData = data?.groups && processMetaGroups(data.groups);
      return { ...data, groups: processedData };
    })
    .catch((error) => {
      throw error;
    });
  return apps;
};

export const addAppToGroup = async (groupId, appId) => {
  return axios
    .post(`${BASE_URL}/addAppToGroup`, {
      data: {
        appId: Number.parseInt(appId, 10),
        groupId: Number.parseInt(groupId, 10),
      },
    })
    .then((response) => {
      dispatch(setSelectedGroup(response.data));
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const removeAppFromGroup = async (groupId, appId) => {
  return axios
    .delete(`${BASE_URL}/removeAppFromGroup`, {
      data: {
        appId: Number.parseInt(appId, 10),
        groupId: Number.parseInt(groupId, 10),
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};