import { useState } from "react";
import "./App.css";
import { AppShell } from "@mantine/core";
import { useHotkeys } from "react-hotkeys-hook";
import { Toaster } from "sonner";
import Header from "./components/Header";
import MainView from "./components/MainView/MainView";
import "@yaireo/tagify/dist/tagify.css";

function App() {
	const [currentListKeys, setCurrentListKeys] = useState([]);
	const [selectedAppKey, setSelectedAppKey] = useState(null);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
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
		console.log("Selected app: ", key);
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
			}
		}
	};

	const gotoNext = () => {
		if (selectedAppKey) {
			const index = findIndex(selectedAppKey);
			if (index < currentListKeys.length - 1) {
				const nextKey = currentListKeys[index + 1].key;
				selectApp(nextKey);
			}
		}
	};

	return (
		<AppShell header={{ height: 60 }}>
			<AppShell.Header withBorder={false} className="appShellHeader" style={{}}>
				<Header
					gotoPrev={gotoPrev}
					gotoNext={gotoNext}
					addItem={addItem}
					isPopoverOpen={isPopoverOpen}
					setIsPopoverOpen={setIsPopoverOpen}
				/>
			</AppShell.Header>
			<AppShell.Main className="appShellMain">
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
				/>
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
