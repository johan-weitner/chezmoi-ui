import axios from "axios";
import { mapEntityToDb, transformNullValues } from "./helpers";

const BASE_URL = "/api";

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
	const updatedNode = mapEntityToDb(updatedData);
	return axios
		.post(`${BASE_URL}/updateNode`, {
			...updatedNode,
			edited: "true",
			tags: updatedNode.tags === null ? "" : updatedNode.tags,
		})
		.then((response) => {
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
	console.log("API: Saving new app:", fixedNullValuesApp);

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
	console.log("Mapped app data:", app);
	for (const key of Object.keys(app)) {
		if (!app[key]) {
			app[key] = "";
		}
	}
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
	// const tagStrArr = tags.map(tag => tag.name);
	return tags;
};

export const addAppTags = async (appId, tags) => {
	console.log("AppId: ", Number.parseInt(appId, 10) || appId, typeof appId);
	console.log("Tags: ", tags);
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

export const deleteAppTag = (tag) => {};

export const getTagsByAppId = async (appId) => {
	const tags = await axios
		.get(`${BASE_URL}/getTagsByAppId?appId=${Number.parseInt(appId, 10)}`)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			throw error;
		});

	console.log("Got tags for appId: ", appId, tags);
	return tags;
};

export const getAllApps = fetchApps;
