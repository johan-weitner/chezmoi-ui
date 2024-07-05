import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { AppShell, Burger } from '@mantine/core';
import { Toaster, toast } from "sonner";
import MainView from "./components/MainView";
import Header from "./components/Header";
import { getMarkedAsEdited, saveMarkedAsEdited } from 'utils/fileHandler.js';
import {
	useQuery,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'
import { fetchAppCollection, fetchAppKeys } from './api/appCollectionApi'

/**
 * The main React component for the application. It handles the state management, API calls, and rendering of the main view.
 *
 * - Fetches the software list from the backend and stores it in the component state.
 * - Provides functions to save the software list, delete an app, save the current state to disk, and start over.
 * - Renders the main view component and passes down the necessary props.
 * - Displays a Toaster component for showing success and error messages.
 */
function App() {
	const [software, setSoftware] = useState(null);
	const [edited, setEdited] = useState(getMarkedAsEdited());
	const baseUrl = '/api';

	useEffect(() => {
		// seedAppList();
	}, []);

	const queryClient = useQueryClient();

	const getApp = key => {
		return appCollectionQuery.data[key];
	};

	const postApp = (item) => {
		updateItem(item);
	}


	const postAppCollection = (item) => {
		// updateItem(item);
	}

	const postAppKeys = (keys) => {
		// console.log(keys);
	}

	// Queries
	const appQuery = useQuery({ queryKey: ['appCollection'], queryFn: getApp });
	const appCollectionQuery = useQuery({
		queryKey: ['appCollection'],
		queryFn: async () => fetchAppCollection()
	});
	const appKeysQuery = useQuery({ queryKey: ['appKeys'], queryFn: async () => fetchAppKeys() });

	// Mutations
	const appMutation = useMutation({
		mutationFn: postApp,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['appCollection'] });
		},
	});

	const appCollectionMutation = useMutation({
		mutationFn: postAppCollection,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['appCollection'] });
		},
	});

	const appKeysMutation = useMutation({
		mutationFn: postAppKeys,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['appKeys'] });
		},
	});

	const saveList = (list) => {
		if (list) {
			setSoftware(list);
			appCollectionMutation.mutate(list);
			appKeysMutation.mutate(Object.keys(list));
		} else {
			console.error("List is empty - cancelling");
		}

	};

	const seedAppList = async () => {
		const seed = await fetchAppCollection();
		saveList(seed);
		console.log("Seeded software: ", seed);
		toast.success("List was successfully seeded");
	};



	const deleteApp = (key) => {
		const appName = software[key]?._name;
		delete software[key];
		saveList({ ...software });
		toast.success(`${appName} was deleted`);
	};

	const saveDocument = () => {
		if (software === null || Object.keys(software).length === 0) {
			toast.error("Critical error - no software list to save");
			return;
		}

		axios
			.post(`${baseUrl}/save`, {
				...software,
			})
			.then((response) => {
				const { data } = response;
				setSoftware((prevState) => ({
					...JSON.parse(data),
				}));
				toast.success("Saved current state to disk");
			})
			.catch((error) => {
				console.error(error);
				toast.error(error);
			});
	};

	const updateItem = (item) => {
		item.edited = true;
		setSoftware((prevState) => ({
			...prevState,
			[item.key]: item
		}));
		toast.success("Item was updated");
	};

	const addNewApp = () => {
		console.log('Add new app');
	};

	return (
		<AppShell
			header={{ height: 40 }}
			padding="md"
		>
			<AppShell.Header withBorder={false}>
				<Header />
			</AppShell.Header>

			<AppShell.Main>
				{software && (
					<MainView
						software={software}
						deleteApp={deleteApp}
						save={saveDocument}
						updateItem={updateItem}
						addNewApp={addNewApp}
						edited={edited}
					/>
				)}
			</AppShell.Main>
			<Toaster position="top-right" theme="dark" expand richColors closeButton pauseWhenPageIsHidden />
		</AppShell>
	);
}

export default App;
