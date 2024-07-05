import { Container, SimpleGrid, useMantineTheme } from "@mantine/core";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";
import AppForm from "./AppForm.jsx";
import DetailView from "./DetailView.jsx";
import classes from "./MainView.module.css";
import MainHeader from "./MainHeader.jsx";
import ListView from "./ListView.jsx";
import { getApp } from "../api/appCollectionApi.js";

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
	// const { software, deleteApp, save, startOver, updateItem } = props;
	const theme = useMantineTheme();
	const [selectedApp, setSelectedApp] = useState(null);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const modalRef = useRef();
	const LIST_INDEX_OFFSET = 4;

	const closePopover = () => {
		setIsPopoverOpen(false);
	};

	const openPopover = () => {
		setIsPopoverOpen(true);
	};

	// const hotkeyOptions = {
	// 	preventDefault: true,
	// 	enableOnFormTags: ['INPUT', 'TEXTAREA']
	// }
	// useHotkeys("esc", () => closePopover()), hotkeyOptions;
	// useHotkeys("alt + left", () => gotoPrev(), hotkeyOptions);
	// useHotkeys("alt + right", () => gotoNext(), hotkeyOptions);
	// useHotkeys("ctrl + s", () => {
	// 	isPopoverOpen ? updateApp(selectedApp) : save();
	// }, hotkeyOptions);
	// useHotkeys("e", () => {
	// 	if (!isPopoverOpen && selectedApp) {
	// 		editItem(selectedApp.key);
	// 	};
	// }, { preventDefault: true, enableOnFormTags: [] });
	// useHotkeys("alt + n", (e) => createNewRecord(e), hotkeyOptions);



	const selectApp = async (e, item) => {
		e?.preventDefault();
		const data = await getApp(item);
		setSelectedApp(data);
	};

	// const deleteItem = () => {
	// 	setSelectedApp(null);
	// 	deleteApp(selectedApp.key);
	// };

	// const editItem = (key, makeSelection = false, isNewApp = false) => {
	// 	console.log(`editItem: ${key}, MakeSelection: ${makeSelection}, New app: ${isNewApp}`);
	// 	makeSelection && key && setSelectedApp(software[key]);
	// 	isNewApp && setSelectedApp(null);
	// 	openPopover();
	// };

	// const updateApp = (updatedApp) => {
	// 	updateItem(updatedApp);
	// 	closePopover();
	// };

	// const createNewRecord = (e) => {
	// 	e.preventDefault();
	// 	setSelectedApp(null);
	// 	openPopover();
	// };

	// const gotoPrev = () => {
	// 	if (selectedApp) {
	// 		const keys = Object.keys(software);
	// 		const newKey = keys[keys.indexOf(selectedApp.key) - 1];
	// 		console.log(keys.indexOf(newKey), newKey > -1);
	// 		if (keys.indexOf(newKey) - LIST_INDEX_OFFSET > -1) {
	// 			selectApp(null, newKey);
	// 		} else {
	// 			toast.warning("Already at the start of list");
	// 		}
	// 	}
	// };

	// const gotoNext = () => {
	// 	if (selectedApp) {
	// 		const keys = Object.keys(software);
	// 		const newKey = keys[keys.indexOf(selectedApp.key) + 1];
	// 		console.log(keys.indexOf(newKey), keys.length, newKey < keys.length);
	// 		if (keys.indexOf(newKey) < keys.length) {
	// 			selectApp(null, newKey);
	// 		} else {
	// 			toast.warning("Already at the end of list");
	// 		}
	// 	}
	// };

	return (
		<>
			<Container
				size="lg"
				py="xl"
				style={{ backgroundColor: "#333", paddingTop: "0px" }}
			>
				<MainHeader
					style={{ borderRadius: "10px" }}
				/>
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
					/>
					{selectedApp && (
						<DetailView
							selectedApp={selectedApp}
							theme={theme}
						/>
					)}

				</SimpleGrid>
				{/* {isPopoverOpen && (
					<AppForm
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
