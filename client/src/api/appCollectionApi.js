import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

import { CACHE_TTL } from "constants/settings";
import { toast } from "sonner";

const BASE_URL = "http://localhost:3000";
const queryClient = new QueryClient();

export const fetchApp = async (key) => {
	let app = {};
	await axios
		.get(`${BASE_URL}/software`)
		.then((response) => {
			const { data } = response;
			app = data[key];
		})
		.catch((error) => {
			console.error(error);
		});
	return app;
};

export const getTotalCount = async () => {
	const count = await queryClient.fetchQuery({
		queryKey: ["appCollection"],
		queryFn: async () => {
			const response = await axios.get(`${BASE_URL}/getCount`);
			console.log("Total count: ", response.data);
			return response.data;
		},
	});
	return count;
};

export const useAppCollection = () => {
	return useQuery({
		queryKey: ["appCollection"],
		queryFn: async () => {
			const response = await axios.get(`${BASE_URL}/software`);
			return response.data;
		},
	});
};

export const useAppPage = (page = 1, limit = 20) => {
	const skip = (page - 1) * limit;
	const take = limit;
	const response = axios
		.post(`${BASE_URL}/page?skip=${skip}&take=${take}`, {
			skip,
			take,
		})
		.then((response) => {
			return response.data;
		});
};

// const adaptResponseData = (data) => {
// 	const apps = data?.map((item) => {
// 		const obj = JSON.parse(item.JSON);
// 		return obj;
// 	});
// 	return apps;
// };

export const getApp = (key) => {
	const app = queryClient.fetchQuery({
		queryKey: ["appCollection"],
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

export const useAppMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// mutationFn: (updatedNode) => {
		// 	updatedNode.edited = true;
		// 	const result = axios
		// 		.post(`${BASE_URL}/updateNode`, {
		// 			...updatedNode,
		// 		})
		// 		.then((response) => {
		// 			return response.data;
		// 		})
		// 		.catch((error) => {
		// 			console.error(error.message);
		// 			toast(error.message);
		// 		});
		// 	return result.data;
		// },
		mutationFn: (updatedNode) => {
			updatedNode.edited = true;
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
					throw error; // Ensure errors are propagated up.
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

export const addApp = async (data) => {
	// const queryClient = useQueryClient();
	return await queryClient
		.fetchQuery({
			queryKey: ["appCollection"],
			queryFn: async () => {
				const result = await axios
					.post(`${BASE_URL}/addNode`, {
						data: { ...data },
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
					return [...old, data];
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
			console.log("API: Got result: ", result);
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
