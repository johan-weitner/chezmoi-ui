import axios from "axios";
import { mapEntityToDb, transformNullValues } from "./helpers";
import { log } from 'utils/logger';
import { useClientManager } from "core/ClientManager";

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

export const fetchUnfinishedApps = async () => {
	const apps = await axios
		.get(`${BASE_URL}/softwareNotDone`)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			throw error;
		});
	return apps;
};

export const fetchFilteredApps = async (filter) => {
	const apps = await axios
		.get(`${BASE_URL}/filterBy?filter=${filter}`)
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
	throw new Error("Query returned no list");
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

export const updateApp = async (updatedData, tags = [], groups = []) => {
	const { getGroupId } = useClientManager();
	const groupIds = groups.map((group) => { return getGroupId(group) });
	return axios
		.post(`${BASE_URL}/updateNode`, {
			...updatedData,
			appTags: tags,
			appGroups: groupIds
		})
		.then((response) => {
			log.debug(
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
	log.debug("API: Saving new app - in-data:", data);
	const app = mapEntityToDb(data);
	const fixedNullValuesApp = transformNullValues(app);
	log.debug("API: Saving new app - fixed data:", fixedNullValuesApp);

	const { getGroupId } = useClientManager();
	const { appTags, ApplicationGroup } = data;
	const groups = ApplicationGroup?.map((group) => {
		return getGroupId(group);
	});

	return axios
		.post(`${BASE_URL}/addNode`, {
			data: {
				...fixedNullValuesApp,
				appTags: appTags,
				appGroups: groups,
				edited: true,
			},
		})
		.then((response) => {
			const { data } = response;
			log.debug("API: Saved new app - response:", data);
			return data;
		})
		.catch((error) => {
			throw error;
		});
};

export const deleteApp = async (id) => {
	log.debug("Deleting app with id: ", id);
	const result = await axios
		.delete(`${BASE_URL}/deleteNode`, {
			params: {
				id: id,
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

export const markAppDone = async (app, flag) => {
	const update = { id: app.id, done: flag };
	log.debug("Flagged app: ", update);
	updateApp(update)
		.then((response) => {
			return response;
		})
		.catch((error) => {
			throw error;
		});
};

export const getAllApps = fetchApps;
