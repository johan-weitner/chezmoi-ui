import {
	QueryCache,
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient
} from "@tanstack/react-query";
import axios from "axios";

import { toast } from "sonner";
import { CACHE_TTL } from "constants/settings";
import { filterUnwantedNodes } from "../utils/installDoctorFilter";

const BASE_URL = "http://localhost:3000";
const queryClient = new QueryClient();

export const fetchApp = async (key) => {
	console.log("Fetching app...", key);
	let app = {};
	await axios
		.get(`${BASE_URL}/software`)
		.then((response) => {
			const { data } = response;
			app = data[key];
			console.log("Got app: ", app);
		})
		.catch((error) => {
			console.error(error);
		});
	return app;
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

export const useApp = (key) => {
	return useQuery({
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
};

export const getApp = async (key) => {
	const app = await queryClient.fetchQuery({
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

// React Query hook to fetch the loading flag. This flag is only stored in the React Query store and not in the server.
export const useLoading = () => {
	return useQuery({
		queryKey: ["loading"],
		queryFn: async () => {
			// Simulate fetching data from the React Query store
			return queryClient.getQueryData(["loading"]);
		},
	});
};

// React Query hook to mutate the loading flag
export const useLoadingMutation = () => {
	return useMutation({
		mutationFn: (flag) => {
			return { data: { ...flag } };
		},
		onSettled: () => {
			queryClient.invalidateQueries(["loading"]);
		},
	});
};


const postAppUpdate = async (item) => {
	console.log("Updating app: ", item);
	if (!item) return;
	let result;
	item.edited = true;

	await axios
		.post(`${BASE_URL}/updateNode`, {
			...item,
		})
		.then((response) => {
			result = response;
			// toast.success("Saved current state to disk");
		})
		.catch((error) => {
			console.error(error);
			// toast.error(error);
		});
	// toast.success("Item was updated");
	return result;
};

const postNewApp = async (item) => {
	console.log("Adding app: ", item);
	if (!item) return;
	let result;
	item.edited = true;

	await axios
		.post(`${BASE_URL}/addNode`, {
			...item,
		})
		.then((response) => {
			result = response;
			// toast.success("Saved current state to disk");
		})
		.catch((error) => {
			console.error(error);
			// toast.error(error);
		});
	// toast.success("Item was updated");
	return result;
};

const postAppCollection = async (item) => {
	console.log("Save app collection");
	const apps = useAppCollection();
	const update = {
		...apps,
		[item.key]: item,
	};
	await axios
		.post(`${BASE_URL}/save`, {
			...update,
		})
		.then((response) => {
			const { data } = response;
			// toast.success("Saved current state to disk");
			console.log("Saved current state to disk");
		})
		.catch((error) => {
			console.error(error);
			// toast.error(error);
		});
	// toast.success("Item was updated");
	return update;
};

export const useAppMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (updatedNode) => {
			updatedNode.edited = true;
			const result = axios
				.post(`${BASE_URL}/updateNode`, {
					...updatedNode,
				})
				.then((response) => {
					return response.data;
				})
				.catch((error) => {
					console.error(error.message);
					toast(error.message);
				});
			return result.data;
		},
		onMutate: async (updatedNode) => {
			await queryClient.cancelQueries(['appCollection']);
			const previousData = queryClient.getQueryData(['appCollection']);
			const keys = Object.keys(previousData);

			queryClient.setQueryData(['appCollection'], (old) => {
				return keys.map((key) => {
					return key === updatedNode.key ? { ...old[key], ...updatedNode } : old[key]
				});
			});
			return { previousData };
		},
		onError: (err, updatedNode, context) => {
			queryClient.setQueryData(['appCollection'], context.previousData);
			return { status: 'error', error: err.message };
		},
		onSettled: () => {
			queryClient.invalidateQueries(['appCollection']);
			return { status: 'success' };
		},
	});
};




export const useAppCollectionMutation = () => {
	return useMutation({
		mutationFn: async () => postAppCollection(),
		// onSuccess: () => {
		//   queryClient.invalidateQueries({ queryKey: ['appCollection'] });
		// },
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ["appCollection"] }),
	});
};

function useEditNode() {
	const queryClient = useQueryClient();

	return useMutation(
		async ({ key, newValue }) => {
			const response = await fetch(`/api/endpoint/${key}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newValue),
			});
			return response.json();
		},
		{
			onMutate: async ({ key, newValue }) => {
				await queryClient.cancelQueries("data");
				const previousData = queryClient.getQueryData("data");

				queryClient.setQueryData("data", (oldData) =>
					oldData.map((item) =>
						item.key === key ? { ...item, ...newValue } : item,
					),
				);

				return { previousData };
			},
			onError: (err, variables, context) => {
				queryClient.setQueryData("data", context.previousData);
			},
			onSettled: () => {
				queryClient.invalidateQueries("data");
			},
		},
	);
}
