import axios from "axios";
import { mapEntityToDb, transformNullValues } from "./helpers";
import { processMetaGroups, testProcessMetaGroups } from "utils/groupUtils";
import {
  getState,
  store,
  setSelectedGroup
} from "store/store";
import { log } from 'utils/logger';
import { useClientManager } from "core/ClientManager";

const { dispatch } = store;
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const DEBUG = import.meta.env.VITE_DEBNUG === "true";

export const getAllTags = async () => {
  const tags = await axios
    .get(`${BASE_URL}/getAllTags`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
  return tags;
};

export const addAppTags = async (appId, tags) => {
  if (DEBUG) {
    log.debug("AppId: ", Number.parseInt(appId, 10) || appId, typeof appId);
    log.debug("Tags: ", tags);
  }

  return axios
    .post(`${BASE_URL}/addAppTags`, {
      data: {
        appId: Number.parseInt(appId, 10),
        tagId: tags,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getTagId = tagName => {
  const existingTags = getState().allowedTags;
  const found = existingTags.find(item => item.name === tagName);
  log.debug("Found tag: ", found);
  return found ? found.id : -1;
}

export const updateTagWhiteList = async (tags) => {
  const existingTags = getState().allowedTags;
  const existingTagNames = existingTags.map(tag => tag.name);
  const newTags = tags.filter(tag => !existingTagNames.includes(tag));
  const removedTags = existingTagNames.filter(tag => !tags.includes(tag));
  let tagsToRemove = [];

  if (removedTags.length > 0) {
    tagsToRemove = removedTags.map(tag => {
      return getTagId(tag);
    });
    log.debug("Tags to remove", tagsToRemove);
  }

  const allowedTags = await axios
    .post(`${BASE_URL}/updateAllowedTags`, {
      data: {
        removeTags: tagsToRemove,
        addTags: newTags,
      },
    })
    .then((response) => {
      log.debug("Allowed tags updated: ", response.data);
      return response.data;
    })
    .catch((error) => {
      throw error;
    });

  return allowedTags;
};