import { useEffect, useState, useRef } from "react";
import "./App.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Header from "./components/Header";
import MainView from "./components/MainView";
import {
	Button,
	Flex,
	Grid,
	useMantineTheme,
	AppShell
} from "@mantine/core";
import BarSpinner from "components/BarSpinner.jsx";
import EditView from "./components/EditView/EditView";
import { getApp } from "api/appCollectionApi";
import "@yaireo/tagify/dist/tagify.css";


/**
 * The main React component for the application. It handles the state management, API calls, and rendering of the main view.
 *
 * - Fetches the software list from the backend and stores it in the component state.
 * - Provides functions to save the software list, delete an app, save the current state to disk, and start over.
 * - Renders the main view component and passes down the necessary props.
 * - Displays a Toaster component for showing success and error messages.
 */
function App() {
	const BASE_URL = "/api";
	const theme = useMantineTheme();
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [selectedApp, setSelectedApp] = useState(null);
	const modalRef = useRef();

	const useAppCollection = () => {
		return useQuery({
			queryKey: ["appCollection"],
			queryFn: async () => {
				const response = await axios.get(`${BASE_URL}/software`);
				return response.data;
			},
		});
	};

	const useApp = (key) => {
		return useQuery({
			queryKey: ["app"],
			queryFn: async () => {
				const response = await axios.get(`${BASE_URL}/getApp?key=${key}`);
				return response.data;
			},
		});
	};

	const openApp = async key => {
		const app = await getApp(key);
		setSelectedApp(app);
		setIsPopoverOpen(true);
	};

	const { data, error, isLoading } = useAppCollection();

	if (isLoading) return <div>Loading...</div>;
	if (error) {
		if (error) {
			toast.error("Error: ", error.message);
			// return <div>Error: {error.message}</div>;
		}
	}

	return (
		<AppShell header={{ height: 40 }} padding="md">
			<AppShell.Header withBorder={false}>
				<Header />
				{isLoading && <BarSpinner />}
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
