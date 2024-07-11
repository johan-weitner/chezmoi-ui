import { useState } from "react";
import "./App.css";
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
	useHotkeys("alt + b", () => gotoPrev());
	useHotkeys("alt + n", () => gotoNext());
	useHotkeys("alt + left", () => gotoPrev());
	useHotkeys("alt + right", () => gotoNext());
	useHotkeys("alt + n", () => addItem());
	useHotkeys("alt + e", () => editItem());

	const addItem = () => {
		setSelectedAppKey(null);
		setIsPopoverOpen(true);
	};

	const editItem = () => {
		selectedAppKey && setIsPopoverOpen(true);
	};

	const updateCurrentListKeys = (keys) => {
		setCurrentListKeys(keys);
	};

	const selectApp = (key) => {
		setSelectedAppKey(key);
	};

	const findIndex = (key) => {
		return currentListKeys.findIndex((item) => item.key === key);
	};

	const gotoPrev = () => {
		if (selectedAppKey) {
			const index = findIndex(selectedAppKey);
			if (index > 0) {
				const prevKey = currentListKeys[index - 1].key;
				selectApp(prevKey);
			} else if (currentPage > 1) {
				console.log("Reached beginning of page, flipping to previous page...");
				setCurrentPage(currentPage - 1);
				// setSelectedAppKey(currentListKeys[currentListKeys.length - 1].key);
			}
		}
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
				// setSelectedAppKey(currentListKeys[0].key);
			}
		}
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
				isPopoverOpen={isPopoverOpen}
				setIsPopoverOpen={setIsPopoverOpen}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				numPages={numPages}
				setNumPages={setNumPages}
				totalCount={totalCount}
				setTotalCount={setTotalCount}
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
