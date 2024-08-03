import axios from "axios";
import { mapEntityToDb, transformNullValues } from "./helpers";
import { processMetaGroups, testProcessMetaGroups } from "utils/groupUtils";
import { rootStore } from "store/store";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const DEBUG = import.meta.env.VITE_DEBNUG === "true";

export const fetchApps = async () => {
	const apps = await axios
		.get(`${BASE_URL}/software`)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			throw error;
		});
	return apps;
};

export const fetchAppGroups = async () => {
	const apps = await axios
		.get(`${BASE_URL}/groups`)
		.then((response) => {
			const { data } = response;
			// testProcessMetaGroups();
			const processedData = data?.groups && processMetaGroups(data.groups);
			return { ...processedData };
		})
		.catch((error) => {
			throw error;
		});
	return apps;
}; // fetchAppsInGroup,

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

export const fetchGroupApps = async (appId) => {
	if (!appId) return;
	const groups = await axios
		.get(`${BASE_URL}/app-groups?appId=${appId}`)
		.then((response) => {
			return response;
		})
		.catch((error) => {
			throw error;
		});
	return groups;
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

export const fetchAppPage = async (page = 1, limit = 20) => {
	const apps = (await fetchApps()) || [];
	return getPageSlice(page, limit, apps);
};

export const getPageSlice = (page, limit, appCollection) => {
	const skip = page === 1 ? 0 : (page - 1) * limit;
	const take = limit;
	if (Array.isArray(appCollection)) {
		const slice =
			Array.isArray(appCollection) && appCollection?.slice(skip, skip + take);
		return slice;
	}
	throw new Error("Query returned no listt");
};

export const fetchApp = async (key) => {
	const app = await axios
		.get(`${BASE_URL}/getApp?key=${key}`)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			throw error;
		});
	return transformNullValues(app);
};

export const updateApp = async (updatedData) => {
	return axios
		.post(`${BASE_URL}/updateNode`, {
			...updatedData,
			edited: "true",
			tags: updatedData.tags === null ? "" : updatedData.tags,
		})
		.then((response) => {
			DEBUG &&
				console.log(
					`API: Updating app:
		- Tags: `,
					response.data,
				);
			return response.data;
		})
		.catch((error) => {
			throw error;
		});
};

export const saveNewApp = async (data) => {
	const app = mapEntityToDb(data);
	const fixedNullValuesApp = transformNullValues(app);
	DEBUG && console.log("API: Saving new app:", fixedNullValuesApp);

	return axios
		.post(`${BASE_URL}/addNode`, {
			data: {
				...fixedNullValuesApp,
				edited: "true",
			},
		})
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			throw error;
		});
};

export const deleteApp = async (key) => {
	const result = await axios
		.delete(`${BASE_URL}/deleteNode`, {
			params: {
				key: key,
			},
		})
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			throw error;
		});
	return result;
};

export const addApp = (data) => {
	const app = mapEntityToDb(data);
	app.edited = "true";
	DEBUG && console.log("API: Mapped app data:", app);
	for (const key of Object.keys(app)) {
		if (!app[key]) {
			app[key] = "";
		}
	}
};

export const markAppDone = async (app, flag) => {
	const flaggedApp = Object.assign(app, { done: flag });
	updateApp(flaggedApp)
		.then((response) => {
			return response;
		})
		.catch((error) => {
			throw error;
		});
};

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
		console.log("AppId: ", Number.parseInt(appId, 10) || appId, typeof appId);
		console.log("Tags: ", tags);
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

export const deleteAppTag = (tag) => { };

export const getTagsByAppId = async (appId) => {
	const tags = await axios
		.get(`${BASE_URL}/getTagsByAppId?appId=${Number.parseInt(appId, 10)}`)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			throw error;
		});

	DEBUG && console.log("Got tags for appId: ", appId, tags);
	return tags;
};

export const getTagId = tagName => {
	const existingTags = rootStore.get.allowedTags();
	const found = existingTags.find(item => item.name === tagName);
	console.log("Found tag: ", found);
	return found ? found.id : -1;
}

export const updateTagWhiteList = async (tags) => {
	const existingTags = rootStore.get.allowedTags();
	const existingTagNames = existingTags.map(tag => tag.name);
	const newTags = tags.filter(tag => !existingTagNames.includes(tag));
	const removedTags = existingTagNames.filter(tag => !tags.includes(tag));

	console.log("Not Existing tags", existingTags);
	console.log("New tags", newTags);
	console.log("Removed tags", removedTags);

	let tagsToRemove = [];
	let tagsToAdd = [];

	if (removedTags.length > 0) {
		tagsToRemove = removedTags.map(tag => {
			return getTagId(tag);
		});
		console.log("Tags to remove", tagsToRemove);
	}

	const allowedTags = await axios
		.post(`${BASE_URL}/updateAllowedTags`, {
			data: {
				removeTags: tagsToRemove,
				addTags: newTags,
			},
		})
		.then((response) => {
			console.log("Allowed tags updated: ", response.data);
			return response.data;
		})
		.catch((error) => {
			throw error;
		});

	// return tags?.map(tag => { return { id: 0, name: tag } });
	return allowedTags;
};

export const getAllApps = fetchApps;
