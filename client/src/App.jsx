import { useState, useContext } from "react";
import "./App.css";
import {
	deleteApp,
	getNoInstallerApps,
	getNoUrlsApps,
	getNoDescApps,
	getNoNameApps,
} from "api/appCollectionApi.js";
import { useHotkeys } from "react-hotkeys-hook";
import { Toaster } from "sonner";
import MainView from "./components/MainView/MainView";
import "@yaireo/tagify/dist/tagify.css";

function App() {
	const [currentListKeys, setCurrentListKeys] = useState([]);
	const [selectedAppKey, setSelectedAppKey] = useState(null);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [numPages, setNumPages] = useState(1);
	const [totalCount, setTotalCount] = useState(1);
	const [inReverse, setInReverse] = useState(false);
	const [filteredView, setFilteredView] = useState(null);
	const [useFilter, setUseFilter] = useState(false);

	useHotkeys("alt + b", () => gotoPrev());
	useHotkeys("alt + n", () => gotoNext());
	useHotkeys("alt + left", () => gotoPrev());
	useHotkeys("alt + right", () => gotoNext());
	useHotkeys("alt + n", () => addItem());
	useHotkeys("alt + e", () => editItem());
	useHotkeys("shift + alt + left", () => gotoPrevPage());
	useHotkeys("shift + alt + right", () => gotoNextPage());
	useHotkeys("alt + w", () => unselectApp());

	const unselectApp = () => {
		setSelectedAppKey(null);
		setIsPopoverOpen(false);
	};

	const addItem = () => {
		setSelectedAppKey(null);
		setIsPopoverOpen(true);
	};

	const editItem = (key = selectedAppKey) => {
		if (key !== selectedAppKey) {
			setSelectedAppKey(key);
		}
		selectedAppKey && setIsPopoverOpen(true);
	};

	const deleteItem = (key = selectedAppKey) => {
		deleteApp(key).then((res) => {
			console.log("Deleted app: ", res);
		});
	};

	const updateCurrentListKeys = (keys) => {
		setCurrentListKeys(keys);
	};

	const selectApp = (key) => {
		console.log(`Selected app with key: ${key}`);
		setSelectedAppKey(key);
		setInReverse(false);
	};

	const findIndex = (key) => {
		return currentListKeys.findIndex((item) => item.key === key);
	};

	const gotoPrev = () => {
		console.log(
			`selectedAppKey: ${selectedAppKey}, currentListKeys: ${currentListKeys}`,
		);
		if (selectedAppKey) {
			const index = findIndex(selectedAppKey);
			if (index > 0) {
				const prevKey = currentListKeys[index - 1].key;
				selectApp(prevKey);
			} else if (currentPage > 1) {
				console.log("Reached beginning of page, flipping to previous page...");
				setInReverse(true);
				setCurrentPage(currentPage - 1);
			}
		}
		console.log(`selectedAppKey: ${selectedAppKey}, index: ${index}`);
	};

	const gotoNext = () => {
		if (selectedAppKey) {
			const index = findIndex(selectedAppKey);
			if (index < currentListKeys.length - 1) {
				const nextKey = currentListKeys[index + 1].key;
				selectApp(nextKey);
			} else if (currentPage < numPages) {
				console.log("Reached end of page, flipping to next page...");
				setCurrentPage(currentPage + 1);
			}
		}
	};

	const gotoPrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const gotoNextPage = () => {
		if (currentPage < numPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const initFilteredView = () => {
		setFilteredView(null);
		setUseFilter(true);
		setSelectedAppKey(null);
	};

	const restoreFilters = () => {
		setFilteredView(null);
		setUseFilter(false);
		setTotalCount(1);
		setCurrentListKeys([]);
		setNumPages(1);
		setSelectedAppKey(null);
	};

	return (
		<>
			{/* <AppShell header={{ height: 0 }}> */}
			{/* <AppShell.Header withBorder={false}>
					<Center size="xl" px={0} py={0} m={0} style={{ border: "1px solid #393" }}>
						<Header />
					</Center>
				</AppShell.Header> */}
			{/* <AppShell.Main className="appShellMain"> */}
			<MainView
				currentListKeys={currentListKeys}
				updateCurrentListKeys={updateCurrentListKeys}
				selectedAppKey={selectedAppKey}
				setSelectedAppKey={setSelectedAppKey}
				selectApp={selectApp}
				gotoPrev={gotoPrev}
				gotoNext={gotoNext}
				addItem={addItem}
				editItem={editItem}
				deleteApp={deleteItem}
				isPopoverOpen={isPopoverOpen}
				setIsPopoverOpen={setIsPopoverOpen}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				numPages={numPages}
				setNumPages={setNumPages}
				totalCount={totalCount}
				setTotalCount={setTotalCount}
				inReverse={inReverse}
				filteredView={filteredView}
				initFilteredView={initFilteredView}
				restoreFilters={restoreFilters}
			/>
			{/* </AppShell.Main> */}
			<Toaster
				position="top-right"
				theme="dark"
				expand
				richColors
				closeButton
				pauseWhenPageIsHidden
			/>
			{/* </AppShell> */}
		</>
	);
}

export default App;
