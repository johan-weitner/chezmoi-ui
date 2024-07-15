import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

import { CACHE_TTL } from "constants/settings";
import { toast } from "sonner";
import { APP_FORM } from "../constants/appForm";
import { filterNoInstallerApps, filterNoUrlsApps, filterNoDescsApps, filterNoNamesApps } from "./filters";

const BASE_URL = "http://localhost:3000";
const queryClient = new QueryClient();

export const FILTER = {
	noInstallers: {
		key: "noInstallers",
		method: filterNoInstallerApps,
		title: "Apps without installers",
	},
	noUrls: {
		key: "noUrls",
		method: filterNoUrlsApps,
		title: "Apps without URLs",
	},
	noDesc: {
		key: "noDesc",
		method: filterNoDescsApps,
		title: "Apps without name",
	},
	noName: {
		key: "noName",
		method: filterNoNamesApps,
		title: "Apps without description",
	},
};


// React Query hook that stores the current page number and limit, and methods for mutatning current page
export const usePageManager = (initialPage = 1, initialLimit = 20, initialTotalCount = 0) => {
	const [page, setPage] = useState(initialPage);
	const [limit, setLimit] = useState(initialLimit);
	const [pageCount, setPageCount] = useState(1);
	const [totalCount, setTotalCount] = useState(initialTotalCount);
	const [lastChange, setLastChange] = useState(new Date().getTime());
	const [activeFilter, setActiveFilter] = useState(null);

	const queryClient = useQueryClient();

	const gotoPrev = () => {
		setPage((prev) => Math.max(prev - 1, 1));
	};

	const gotoNext = () => {
		setPage((prev) => prev + 1);
	}

	const gotoPrevPage = () => {
		setPage((prev) => Math.max(prev - 10, 1));
	}

	const gotoNextPage = () => {
		setPage((prev) => prev + 10);
	}

	const initFilteredView = (filter) => {
		setActiveFilter(filter);

		const currentData = queryClient.getQueryData(['appCollection']) || [];
		const filteredData = currentData.filter(app => FILTER[filter].method(app));
		queryClient.setQueryData(['appCollection'], filteredData);
	}

	const restoreFilters = () => {
		queryClient.invalidateQueries(["appCollection"]);
	}

	return {
		page,
		limit,
		setPage,
		setLimit,
		lastChange,
		gotoPrev,
		gotoNext,
		gotoPrevPage,
		gotoNextPage,
		initFilteredView,
		restoreFilters,
	};
};

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

const mapAppData = (app) => {
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

export const getTotalCount = async () => {
	const count = await queryClient.fetchQuery({
		queryKey: ["appCollection"],
		queryFn: async () => {
			const response = await axios.get(`${BASE_URL}/getCount`);
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
			return useAppCollection();
		},
	});
};





export const useAppPage = (page = 1, limit = 20) => {
	const skip = (page - 1) * limit;
	const take = limit;
	return axios
		.post(`${BASE_URL}/page?skip=${skip}&take=${take}`, {
			skip,
			take,
		})
		.then((response) => {
			return response.data;
		});
};

export const getAppPage = (page = 1, limit = 20) => {
	const skip = page === 1 ? 0 : (page - 1) * limit;
	const take = limit;

	const apps = getAllApps()
		.then((apps) => {
			// console.log('All apps:', apps?.length);
			console.log('Skip - Take:', skip, take);
			console.log('Page - Limit:', page, limit);
			const slice = apps.slice(skip, skip + take);
			// console.log('Slice:', slice);
			return slice;
		})
		.catch((error) => {
			console.error(error);
		});
	return apps;
};




export const getNoInstallerApps = async () => {
	const apps = await useAppCollection();
	return filterNoInstallerApps();
	// const apps = queryClient.fetchQuery({
	// 	queryKey: ["appCollection"],
	// 	queryFn: async () => {
	// 		const apps = await axios
	// 			.get(`${BASE_URL}/getAppsWithoutInstaller`)
	// 			.then((response) => {
	// 				return response.data;
	// 			})
	// 			.catch((error) => {
	// 				console.error(error);
	// 			});
	// 		return apps;
	// 	},
	// });
	// return apps;
};

export const getNoUrlsApps = async () => {
	const apps = await useAppCollection();
	return filterNoUrlsApps();
	// const apps = queryClient.fetchQuery({
	// 	queryKey: ["appCollection"],
	// 	queryFn: async () => {
	// 		const apps = await axios
	// 			.get(`${BASE_URL}/getAppsWithoutUrls`)
	// 			.then((response) => {
	// 				return response.data;
	// 			})
	// 			.catch((error) => {
	// 				console.error(error);
	// 			});
	// 		return apps;
	// 	},
	// });
	// return apps;
};

export const getNoDescApps = async () => {
	const apps = await useAppCollection();
	return filterNoDescsApps();
	// const apps = queryClient.fetchQuery({
	// 	queryKey: ["appCollection"],
	// 	queryFn: async () => {
	// 		const apps = await axios
	// 			.get(`${BASE_URL}/getAppsWithoutDesc`)
	// 			.then((response) => {
	// 				return response.data;
	// 			})
	// 			.catch((error) => {
	// 				console.error(error);
	// 			});
	// 		return apps;
	// 	},
	// });
	// return apps;
};

export const getNoNameApps = async () => {
	const apps = await useAppCollection();
	return filterNoNamesApps();
	// const apps = queryClient.fetchQuery({
	// 	queryKey: ["appCollection"],
	// 	queryFn: async () => {
	// 		const apps = await axios
	// 			.get(`${BASE_URL}/getAppsWithoutName`)
	// 			.then((response) => {
	// 				return response.data;
	// 			})
	// 			.catch((error) => {
	// 				console.error(error);
	// 			});
	// 		return apps;
	// 	},
	// });
	// return apps;
};

// export const filterNoInstallerApps = async () => {
// 	const apps = await useAppCollection();
// 	return apps.some(item => {
// 		return _isColumnEmpty(item.whalebrew) &&
// 			_isColumnEmpty(item.apt) &&
// 			_isColumnEmpty(item.brew) &&
// 			_isColumnEmpty(item.cask) &&
// 			_isColumnEmpty(item.cargo) &&
// 			_isColumnEmpty(item.npm) &&
// 			_isColumnEmpty(item.pip) &&
// 			_isColumnEmpty(item.pipx) &&
// 			_isColumnEmpty(item.gem) &&
// 			_isColumnEmpty(item.script) &&
// 			_isColumnEmpty(item.choco) &&
// 			_isColumnEmpty(item.scoop) &&
// 			_isColumnEmpty(item.winget) &&
// 			_isColumnEmpty(item.pkgdarwin) &&
// 			_isColumnEmpty(item.ansible) &&
// 			_isColumnEmpty(item.yay) &&
// 			_isColumnEmpty(item.appstore) &&
// 			_isColumnEmpty(item.pacman) &&
// 			_isColumnEmpty(item.port)
// 	});
// };

// const _isColumnEmpty = (column) => {
// 	return column === "" || column === null;
// };

// export const filterNoUrlsApps = async () => {
// 	useAppCollection();
// 	return apps.some((item) => {
// 		return (
// 			_isColumnEmpty(item.home) &&
// 			_isColumnEmpty(item.docs) &&
// 			_isColumnEmpty(item.github)
// 		);
// 	});
// };

// export const filterNoDescsApps = async () => {
// 	useAppCollection();
// 	return apps.some((item) => {
// 		return isColumnEmpty(item.desc);
// 	});
// };

// export const filterNoNamesApps = async () => {
// 	useAppCollection();
// 	return apps.some((item) => {
// 		return isColumnEmpty(item.name);
// 	});
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

export const updateApp = () => {
	return useMutation({
		mutationFn: (updatedData) => {
			updatedData.edited = "true";
			const updatedNode = mapAppData(updatedData);
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
	const app = mapAppData(data);
	app.edited = "true";
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
