import {
	QueryClient,
	useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { APP_FORM } from "../constants/appForm";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const CACHE_TTL = import.meta.env.VITE_CACHE_TTL;

/**
 * Helper functions
 */
const _mapAppData = (app) => {
	const { formPartOne, formPartTwo } = APP_FORM;
	const validKeys = [...formPartOne, ...formPartTwo].map((item) => item.name);
	const entity = {};
	const keys = Object.keys(app);
	keys.map((key) => {
		if (validKeys.includes(key)) {
			entity[key] = app[key];
		}
	});
	return entity;
};

const _transformNullValues = (app) => {
	for (const key of Object.keys(app)) {
		if (!app[key]) {
			app[key] = "";
		}
	}
	return app;
};

/**
 * Raw API functions
 * Typically use React Query-wrapped method for fetching the full app collection,
 * since it's very large and typically never changes. (Changes are saved to the DB
 * in a table for discrete app records, not a hugfe list).
 * Single apps and pages of apps are more transient and the reward for caching them
 * is questionable, so raw API calls should be fine. But there are React Query-wrappers
 * for those too. It's up to you.
 */
export const fetchApps = async () => {
	const apps = await axios
		.get(`${BASE_URL}/software`)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			console.error(error);
		});
	return apps;
};

export const fetchAppPage = async (page = 1, limit = 20) => {
	const skip = page === 1 ? 0 : (page - 1) * limit;
	const take = limit;
	const apps = await queryClient.getQueryData(['appCollection']) || [];
	if (Array.isArray(apps)) {
		const slice = Array.isArray(apps) && apps?.slice(skip, skip + take);
		return slice;
	}
	console.error('Result is not a list: ', apps);
	throw new Error('Query returned no list');
};

export const postUpdatedApp = async () => {
	updatedData.edited = "true";
	const updatedNode = _mapAppData(updatedData);
	return axios
		.post(`${BASE_URL}/updateNode`, {
			...updatedNode,
		})
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			console.error(error.message);
			toast(error.message);
			throw error;
		});
};

export const postNewApp = async (data) => {
	const app = _mapAppData(data);
	app.edited = "true";
	app.desc = app.desc || "No description provided.";
	const fixedNullValuesApp = _transformNullValues(app);

	return axios
		.post(`${BASE_URL}/addNode`, {
			data: { ...fixedNullValuesApp },
		})
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			console.error(error.message);
			toast(error.message);
			throw error;
		});
};

export const postAppDeletion = async (key) => {
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
			console.error(error.message);
			toast(error.message);
		});
	return result;
};

export const rawApi = { fetchApps, fetchAppPage, postUpdatedApp, postNewApp, postAppDeletion };

/**
 * API functions wrapped in React Query
 * The `getAllApps`and `refetchAppCollection` methods are strongly recommended
 * in favour of the raw API calls. The payload is huge and never changes, so it
 * makes no sense to keep fetching it. Better to use the React Query cache.
 */
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

export const getAppPage = (page = 1, limit = 20) => {
	const skip = page === 1 ? 0 : (page - 1) * limit;
	const take = limit;
	const apps = queryClient.fetchQuery({
		queryKey: ["appPage"],
		queryFn: async () => {
			const apps = queryClient.getQueryData(['appCollection']) || [];
			if (Array.isArray(apps)) {
				const slice = Array.isArray(apps) && apps?.slice(skip, skip + take);
				return slice;
			}
			console.error('Result is not a list: ', apps);
			throw new Error('Query returned no list');
		},
	});
	return apps;
};

export const getApp = (key) => {
	const app = queryClient.fetchQuery({
		queryKey: ["appPage"],
		queryFn: async () => {
			const app = await axios
				.get(`${BASE_URL}/getApp?key=${key}`)
				.then((response) => {
					return response.data;
				})
				.catch((error) => {
					console.error(error);
				});
			return app;
		},
	});
	return app;
};

// export const getApp = (key) => {
// 	getAllApps().then((data) => {
// 		const app = queryClient.fetchQuery({
// 			queryKey: ["appPage"],
// 			queryFn: () => {
// 				return data[key];
// 			},
// 		});
// 		return app;
// 	});
// };

export const updateApp = () => {
	return useMutation({
		mutationFn: (updatedData) => {
			updatedData.edited = "true";
			const updatedNode = _mapAppData(updatedData);
			return axios
				.post(`${BASE_URL}/updateNode`, {
					...updatedNode,
				})
				.then((response) => {
					return response.data;
				})
				.catch((error) => {
					console.error(error.message);
					toast(error.message);
					throw error;
				});
		},
		onMutate: async (updatedNode) => {
			await queryClient.cancelQueries(["appCollection"]);
			const previousData = queryClient.getQueryData(["appCollection"]);
			const keys = Object.keys(previousData);

			queryClient.setQueryData(["appCollection"], (old) => {
				return keys.map((key) => {
					return key === updatedNode.key
						? { ...old[key], ...updatedNode }
						: old[key];
				});
			});
			return { previousData };
		},
		onError: (err, updatedNode, context) => {
			queryClient.setQueryData(["appCollection"], context.previousData);
			return { status: "error", error: err.message };
		},
		onSettled: () => {
			queryClient.invalidateQueries(["appCollection"]);
			return { status: "success" };
		},
	});
};

export const addApp = (data) => {
	const app = _mapAppData(data);
	app.edited = "true";
	console.log('Mapped app data:', app);
	for (const key of Object.keys(app)) {
		if (!app[key]) {
			app[key] = "";
		}
	}

	if (!app.desc) {
		app.desc = "No description provided.";
	}
	return queryClient
		.fetchQuery({
			queryKey: ["appCollection"],
			queryFn: async () => {
				axios
					.post(`${BASE_URL}/addNode`, {
						data: { ...app },
					})
					.then((response) => {
						return response.data;
					})
					.catch((error) => {
						console.error(error.message);
						toast(error.message);
						throw error;
					});
			},
			onMutate: async () => {
				await queryClient.cancelQueries(["appCollection"]);
				const previousData = queryClient.getQueryData(["appCollection"]);

				queryClient.setQueryData(["appCollection"], (old) => {
					return [...old, app];
				});
				return { previousData };
			},
			onError: (err, updatedNode, context) => {
				queryClient.setQueryData(["appCollection"], context.previousData);
				return {
					data: { ...updatedNode },
					status: "error",
					error: err.message,
				};
			},
			onSettled: () => {
				queryClient.invalidateQueries(["appCollection"]);
				return { data: { ...updatedNode }, status: "success" };
			},
		})
		.then((result) => {
			return result;
		});
};

export const deleteApp = async (key) => {
	const result = await queryClient.fetchQuery({
		queryKey: ["appCollection"],
		queryFn: async () => {
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
					console.error(error.message);
					toast(error.message);
				});
			return result;
		},
		onMutate: async () => {
			await queryClient.cancelQueries(["appCollection"]);
			const previousData = queryClient.getQueryData(["appCollection"]);

			queryClient.setQueryData(["appCollection"], (old) => {
				return old.filter((item) => item.key !== key);
			});
			return { previousData };
		},
		onError: (err, updatedNode, context) => {
			queryClient.setQueryData(["appCollection"], context.previousData);
			return { status: "error", error: err.message };
		},
		onSettled: () => {
			queryClient.invalidateQueries(["appCollection"]);
			return { status: "success" };
		},
	});
	return result;
};

export const cacheApi = { getAllApps, refetchAppCollection, getAppPage, getApp, updateApp, addApp, deleteApp };