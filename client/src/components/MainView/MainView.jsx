import { Container, SimpleGrid, useMantineTheme } from "@mantine/core";
import { deleteApp, useAppCollection } from "api/appCollectionApi.js";
import DetailView from "components/DetailView/DetailView.jsx";
import ListView from "components/ListView/ListView.jsx";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Header from "../Header.jsx";
import MainHeader from "./MainHeader.jsx";
import classes from "./MainView.module.css";
import "@yaireo/tagify/dist/tagify.css";
import { IconZip } from "@tabler/icons-react";

const MainView = (props) => {
	const {
		currentListKeys,
		updateCurrentListKeys,
		selectedAppKey,
		setSelectedAppKey,
		selectApp,
		gotoPrev,
		gotoNext,
		addItem,
		isPopoverOpen,
		setIsPopoverOpen,
	} = props;
	const theme = useMantineTheme();
	const BASE_URL = "/api";
	// const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const modalRef = useRef();

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
				size="xl"
				className={classes.mainContainer}
				style={{ minHeight: "100% !important" }}
			>
				<Header />
				<SimpleGrid
					cols={{ base: 1, md: 2 }}
					spacing="sm"
					py={12}
					className={classes.grid}
					style={{ minHeight: "100% !important" }}
				>
					<ListView
						theme={theme}
						selectApp={selectApp}
						selectedAppKey={selectedAppKey}
						deleteItem={deleteItem}
						setIsPopoverOpen={setIsPopoverOpen}
						addItem={addItem}
						updateCurrentListKeys={updateCurrentListKeys}
					/>
					{/* {selectedAppKey && ( */}
					<DetailView
						appKey={selectedAppKey}
						theme={theme}
						isPopoverOpen={isPopoverOpen}
						setIsPopoverOpen={setIsPopoverOpen}
						gotoPrev={gotoPrev}
						gotoNext={gotoNext}
					/>
					{/* )} */}
				</SimpleGrid>
			</Container>
		</>
	);
};

export default MainView;
