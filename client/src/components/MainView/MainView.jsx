import { Container, SimpleGrid, useMantineTheme } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { deleteApp, getApp } from "api/appCollectionApi.js";
import axios from "axios";
import DetailView from "components/DetailView/DetailView.jsx";
import ListView from "components/ListView/ListView.jsx";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import MainHeader from "./MainHeader.jsx";
import classes from "./MainView.module.css";
import "@yaireo/tagify/dist/tagify.css";
import { nanoid } from "nanoid";

const MainView = (props) => {
	const theme = useMantineTheme();
	const BASE_URL = "/api";
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [selectedAppKey, setSelectedAppKey] = useState(null);
	const [guid, setGuid] = useState(nanoid());
	const modalRef = useRef();

	const selectApp = (key) => {
		console.log("Selected app: ", key);
		setSelectedAppKey(key);
	};

	const useAppCollection = () => {
		return useQuery({
			queryKey: ["appCollection"],
			queryFn: async () => {
				const response = await axios.get(`${BASE_URL}/software`);
				// console.log(response);
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

	const openApp = async (key) => {
		const app = await getApp(key);
		setSelectedAppKey(app);
		setIsPopoverOpen(true);
	};

	const deleteItem = (key) => {
		console.log("Deleting app with key: ", key);
		if (key === selectedAppKey) setSelectedAppKey(null);
		deleteApp(key)
			.then((res) => {
				setGuid(nanoid());
				// setApps(filteredApps.filter(item => item.key !== key));
				// console.log('Deleted app: ', res);
				// console.log(apps);
			})
			.catch((err) => {
				console.log("Error deleting app: ", err);
			});
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
					<ListView
						theme={theme}
						selectApp={selectApp}
						selectedAppKey={selectedAppKey}
						deleteItem={deleteItem}
						guid={guid}
					/>
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
