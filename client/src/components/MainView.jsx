import { Container, SimpleGrid, useMantineTheme } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { getApp } from "../api/appCollectionApi.js";
import EditView from "./EditView/EditView.jsx";
import DetailView from "./DetailView.jsx";
import ListView from "./ListView.jsx";
import MainHeader from "./MainHeader.jsx";
import classes from "./MainView.module.css";

import {
	AppShell,
	Button,
	Flex,
	Grid
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BarSpinner from "components/BarSpinner.jsx";
import "@yaireo/tagify/dist/tagify.css";

/**
 * The `MainView` component is the main view of the application, responsible for rendering the main header, list view, and detail view.
 * It handles the state and logic for managing the selected app, opening and closing the app form popover, and handling various keyboard shortcuts.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.software - The software data to be displayed.
 * @param {function} props.deleteApp - A function to delete an app.
 * @param {function} props.save - A function to save the current state.
 * @param {function} props.startOver - A function to start over.
 * @param {function} props.updateItem - A function to update an app.
 * @param {function} props.addNewApp - A function to add a new app.
 * @returns {JSX.Element} - The rendered `MainView` component.
 */
const MainView = (props) => {
	const theme = useMantineTheme();
	const BASE_URL = "/api";
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [selectedAppKey, setSelectedAppKey] = useState(null);
	const modalRef = useRef();

	const selectApp = key => {
		setSelectedAppKey(key);
	};

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
		setSelectedAppKey(app);
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
		<>
			<Container
				size="lg"
				py="xl"
				style={{ backgroundColor: "#333", paddingTop: "0px" }}
			>
				<MainHeader style={{ borderRadius: "10px" }} />
				<SimpleGrid
					cols={{ base: 1, md: 2 }}
					spacing="sm"
					mt={50}
					className={classes.grid}
					style={{ backgroundColor: "#333" }}
				>
					<ListView theme={theme} selectApp={selectApp} />
					{selectedAppKey && (
						<DetailView appKey={selectedAppKey} theme={theme} />
					)}
				</SimpleGrid>
				{/* {isPopoverOpen && (
					<EditView
						ref={modalRef}
						isPopoverOpen={isPopoverOpen}
						closePopover={closePopover}
						selectedApp={selectedApp}
						theme={theme}
					/>
				)} */}
			</Container>
		</>
	);
};

export default MainView;
