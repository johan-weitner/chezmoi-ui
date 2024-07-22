import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { mapEntityToDb, transformNullValues } from "./helpers";

const BASE_URL = '/api';
const CACHE_TTL = import.meta.env.VITE_CACHE_TTL;

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
	const apps = await fetchApps() || [];
	return getPageSlice(page, limit, apps);
};

export const getPageSlice = (page, limit, appCollection) => {
	const skip = page === 1 ? 0 : (page - 1) * limit;
	const take = limit;
	if (Array.isArray(appCollection)) {
		const slice = Array.isArray(appCollection) && appCollection?.slice(skip, skip + take);
		return slice;
	}
	throw new Error('Query returned no listt');
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
	return app;
};

export const updateApp = async (updatedData) => {
	console.log('API: Saving new app:', updatedData);
	const updatedNode = mapEntityToDb(updatedData);
	return axios
		.post(`${BASE_URL}/updateNode`, {
			...updatedNode,
			edited: "true"
		})
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			throw error;
		});
};

export const saveNewApp = async (data) => {
	const app = mapEntityToDb(data);
	const fixedNullValuesApp = transformNullValues(app);
	console.log('API: Saving new app:', fixedNullValuesApp);

	return axios
		.post(`${BASE_URL}/addNode`, {
			data: {
				...fixedNullValuesApp,
				edited: "true"
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
	console.log('Mapped app data:', app);
	for (const key of Object.keys(app)) {
		if (!app[key]) {
			app[key] = "";
		}
	}
}

export const invalidateCache = () => {
	queryClient.invalidateQueries(["appCollection", "apps"]);
};

export const rawApi = { fetchApps, fetchAppPage, fetchApp, updateApp, saveNewApp, deleteApp };



const queryClient = new QueryClient();

// Set cache TTL for React Query, defined in local .env file as VITE_CACHE_TTL
queryClient.setDefaultOptions({
	queries: {
		cacheTime: CACHE_TTL,
	},
});

export const getAllApps = () => {
	const apps = queryClient.fetchQuery({
		queryKey: ["appCollection"],
		queryFn: async () => {
			const apps = await axios
				.get(`${BASE_URL}/software`)
				.then((response) => {
					return response.data;
				})
				.catch((error) => {
					console.error(error);
				});
			return apps;
		},
	});
	return apps;
};

export const refetchAppCollection = () => {
	return useQuery({
		queryKey: ["appCollection"],
		queryFn: async () => {
			return getAllApps();
		},
	});
};

export const cacheApi = { getAllApps, refetchAppCollection };