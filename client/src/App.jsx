import { useEffect, useState } from "react";
import "./App.css";
import { AppShell, Burger } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { getMarkedAsEdited, saveMarkedAsEdited } from "utils/fileHandler.js";
import {
	useApp,
	useAppCollection,
	useAppKeys,
} from "./api/appCollectionApi";
import Header from "./components/Header";
import MainView from "./components/MainView";

/**
 * The main React component for the application. It handles the state management, API calls, and rendering of the main view.
 *
 * - Fetches the software list from the backend and stores it in the component state.
 * - Provides functions to save the software list, delete an app, save the current state to disk, and start over.
 * - Renders the main view component and passes down the necessary props.
 * - Displays a Toaster component for showing success and error messages.
 */
function App() {
	// const [software, setSoftware] = useState(null);
	// const baseUrl = '/api';

	useEffect(() => {
		// seedAppList();
	}, []);

	// Queries
	// const appQuery = useApp(key);

	// const {
	// 	data: appCollection,
	// 	status: appCollectionStatus,
	// 	fetchStatus: appCollectionFetchStatus,
	// 	error: appCollectionError
	// } = useAppCollection();
	// const {
	// 	data: appKeys,
	// 	status: appKeysStatus,
	// 	fetchStatus: appKeysFetchStatus,
	// 	error: appKeysError
	// } = useAppKeys();

	// const saveList = (list) => {
	// 	if (list) {
	// 		setSoftware(list);
	// 		appCollectionMutation.mutate(list);
	// 		appKeysMutation.mutate(Object.keys(list));
	// 	} else {
	// 		console.error("List is empty - cancelling");
	// 	}
	// };

	// const seedAppList = async () => {
	// 	const { data: seed } = await useAppCollection();
	// 	saveList(seed);
	// 	console.log("Seeded software: ", seed);
	// 	toast.success("List was successfully seeded");
	// };

	// const deleteApp = (key) => {
	// 	const appName = software[key]?._name;
	// 	delete software[key];
	// 	saveList({ ...software });
	// 	toast.success(`${appName} was deleted`);
	// };

	// const saveDocument = () => {
	// 	if (software === null || Object.keys(software).length === 0) {
	// 		toast.error("Critical error - no software list to save");
	// 		return;
	// 	}

	// 	axios
	// 		.post(`${baseUrl}/save`, {
	// 			...software,
	// 		})
	// 		.then((response) => {
	// 			const { data } = response;
	// 			setSoftware((prevState) => ({
	// 				...JSON.parse(data),
	// 			}));
	// 			toast.success("Saved current state to disk");
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 			toast.error(error);
	// 		});
	// };

	// const updateItem = (item) => {
	// 	item.edited = true;
	// 	setSoftware((prevState) => ({
	// 		...prevState,
	// 		[item.key]: item
	// 	}));
	// 	toast.success("Item was updated");
	// };

	// const addNewApp = () => {
	// 	console.log('Add new app');
	// };

	return (
		<AppShell header={{ height: 40 }} padding="md">
			<AppShell.Header withBorder={false}>
				<Header />
			</AppShell.Header>
			<AppShell.Main>
				<MainView />
			</AppShell.Main>
			<Toaster
				position="top-right"
				theme="dark"
				expand
				richColors
				closeButton
				pauseWhenPageIsHidden
			/>
		</AppShell>
	);
}

export default App;
