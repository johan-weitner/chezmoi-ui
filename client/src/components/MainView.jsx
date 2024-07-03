import { Container, SimpleGrid, useMantineTheme } from "@mantine/core";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";
import AppForm from "./AppForm.jsx";
import DetailView from "./DetailView.jsx";
import classes from "./MainView.module.css";
import MainHeader from "./MainHeader.jsx";
import ListView from "./ListView.jsx";

const MainView = (props) => {
	const { software, deleteApp, save, startOver, updateItem, addNewApp } = props;
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

	const hotkeyOptions = {
		preventDefault: true,
		enableOnFormTags: ['INPUT', 'TEXTAREA']
	}
	useHotkeys("esc", () => closePopover()), hotkeyOptions;
	useHotkeys("alt + left", () => gotoPrev(), hotkeyOptions);
	useHotkeys("alt + right", () => gotoNext(), hotkeyOptions);
	useHotkeys("ctrl + s", () => {
		isPopoverOpen ? updateApp(selectedApp) : save();
	}, hotkeyOptions);
	useHotkeys("e", () => {
		if (!isPopoverOpen && selectedApp) {
			editItem(selectedApp.key);
		};
	}, { preventDefault: true, enableOnFormTags: [] });
	useHotkeys("alt + n", (e) => createNewRecord(e), hotkeyOptions);

	const selectApp = (e, item) => {
		e?.preventDefault();
		setSelectedApp(software[item]);
	};

	const deleteItem = () => {
		setSelectedApp(null);
		deleteApp(selectedApp.key);
	};

	const editItem = (key, makeSelection = false, isNewApp = false) => {
		console.log(`editItem: ${key}, MakeSelection: ${makeSelection}, New app: ${isNewApp}`);
		makeSelection && key && setSelectedApp(software[key]);
		isNewApp && setSelectedApp(null);
		openPopover();
	};

	const updateApp = (updatedApp) => {
		updateItem(updatedApp);
		closePopover();
	};

	const createNewRecord = (e) => {
		e.preventDefault();
		setSelectedApp(null);
		openPopover();
	};

	const gotoPrev = () => {
		if (selectedApp) {
			const keys = Object.keys(software);
			const newKey = keys[keys.indexOf(selectedApp.key) - 1];
			console.log(keys.indexOf(newKey), newKey > -1);
			if (keys.indexOf(newKey) - LIST_INDEX_OFFSET > -1) {
				selectApp(null, newKey);
			} else {
				toast.warning("Already at the start of list");
			}
		}
	};

	const gotoNext = () => {
		if (selectedApp) {
			const keys = Object.keys(software);
			const newKey = keys[keys.indexOf(selectedApp.key) + 1];
			console.log(keys.indexOf(newKey), keys.length, newKey < keys.length);
			if (keys.indexOf(newKey) < keys.length) {
				selectApp(null, newKey);
			} else {
				toast.warning("Already at the end of list");
			}
		}
	};

	const overlayClass = isPopoverOpen ? classes.overlay : classes.hidden;

	return (
		<>
			<Container
				size="lg"
				py="xl"
				style={{ backgroundColor: "#333", paddingTop: "0px" }}
			>
				<MainHeader
					save={save}
					startOver={startOver}
					style={{ borderRadius: "10px" }}
				/>
				<SimpleGrid
					cols={{ base: 1, md: 2 }}
					spacing="sm"
					mt={50}
					className={classes.grid}
					style={{ backgroundColor: "#333" }}
				>
					{software && (
						<ListView
							software={software}
							theme={theme}
							selectApp={selectApp}
							deleteItem={deleteApp}
							editItem={editItem}
						/>
					)}
					{selectedApp && (
						<DetailView
							selectedApp={selectedApp}
							theme={theme}
							deleteItem={deleteItem}
							editItem={editItem}
							gotoPrev={gotoPrev}
							gotoNext={gotoNext}
						/>
					)}
				</SimpleGrid>
				{isPopoverOpen && (
					<AppForm
						ref={modalRef}
						isPopoverOpen={isPopoverOpen}
						closePopover={closePopover}
						updateApp={updateApp}
						selectedApp={selectedApp}
						gotoPrev={gotoPrev}
						gotoNext={gotoNext}
						theme={theme}
						isNewApp={!selectedApp}
					/>
				)}
			</Container>
		</>
	);
};

export default MainView;
