import { Container, SimpleGrid, useMantineTheme } from "@mantine/core";
import { deleteApp, useAppCollection } from "api/appCollectionApi.js";
import DetailView from "components/DetailView/DetailView.jsx";
import ListView from "components/ListView/ListView.jsx";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import MainHeader from "./MainHeader.jsx";
import classes from "./MainView.module.css";
import "@yaireo/tagify/dist/tagify.css";

const MainView = (props) => {
	const theme = useMantineTheme();
	const BASE_URL = "/api";
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [selectedAppKey, setSelectedAppKey] = useState(null);
	const modalRef = useRef();

	const selectApp = (key) => {
		console.log("Selected app: ", key);
		setSelectedAppKey(key);
	};

	const deleteItem = (key) => {
		console.log("Deleting app with key: ", key);
		if (key === selectedAppKey) setSelectedAppKey(null);
		deleteApp(key)
			.then((res) => {
				// setApps(filteredApps.filter(item => item.key !== key));
				// console.log('Deleted app: ', res);
				// console.log(apps);
			})
			.catch((err) => {
				console.log("Error deleting app: ", err);
			});
	};

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
						setIsPopoverOpen={setIsPopoverOpen}
					/>
					{/* {selectedAppKey && ( */}
					<DetailView
						appKey={selectedAppKey}
						theme={theme}
						isPopoverOpen={isPopoverOpen}
						setIsPopoverOpen={setIsPopoverOpen}
					/>
					{/* )} */}
				</SimpleGrid>
			</Container>
		</>
	);
};

export default MainView;
