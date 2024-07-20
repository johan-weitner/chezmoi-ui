import { useState } from "react";
import { Card, Skeleton } from "@mantine/core";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import classes from "views/MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListSkeleton } from "./ListSkeleton";
import { selectPageContent } from "store/selectors";
import { rootStore } from "store/store";
import { useClientManager } from "core/ClientManager";

const List = (props) => {
	const state = rootStore.store.getState();
	const { isLoading, error, pageContent, page, selectedAppKey } = state;
	const {
		seedStore,
		getPageContent,
		setSelectedAppKey,
		deleteItem,
		editItem,
		addItem,
		selectPrevApp,
		selectNextApp,
	} = useClientManager();
	const [list, setList] = useState([]);

	useHotkeys("alt + b", () => selectPrevApp());
	useHotkeys("alt + n", () => selectNextApp());
	useHotkeys("alt + left", () => selectPrevApp());
	useHotkeys("alt + right", () => selectNextApp());
	useHotkeys("alt + n", () => addItem());
	useHotkeys("alt + e", () => editItem());
	useHotkeys("shift + alt + left", () => gotoPrevPage());
	useHotkeys("shift + alt + right", () => gotoNextPage());
	useHotkeys("alt + w", () => clearAppSelection());

	const skeleton = Array(20);
	skeleton.fill(<ListSkeleton />, 0, 20);

	// useEffect(() => {
	// 	console.log("PageContent:", pageContent);
	// 	if (!Array.isArray(pageContent)) {
	// 		console.warn("PageContent is not an array");
	// 		return;
	// 	}
	// 	setList(rootStore.get.pageContent());
	// }, [page, pageContent]);

	const [currentPage, setCurrentPage] = useState(1);
	const [currentApp, setCurrentApp] = useState(null);
	const [date, setDate] = useState(null);
	const runOnce = true;
	useEffect(() => {
		console.log("Seeding store...");
		const list = seedStore();
		setList(list);
	}, []);

	useEffect(() => {
		console.log("New page: ", currentPage);
		rootStore.set.page(currentPage);
		console.log("Set in store: ", rootStore.get.page());
		const apps = selectPageContent(state);
		setList(apps);
	}, [currentPage]);

	useEffect(() => {
		console.log("!!! Updating app");
		setCurrentApp(selectedAppKey);
	}, [selectedAppKey]);

	useEffect(() => {
		console.log("!!! Updating content");
		setList(pageContent);
	}, [pageContent]);

	// const gotoPage = (page) => {
	// 	console.log(`Goto page: ${page}`);
	// 	setCurrentPage(page);
	// 	rootStore.set.page(page);
	// };

	return (
		<Card
			shadow="md"
			fz="sm"
			c="dimmed"
			mt="sm"
			className={classes.scrollContainer}
			style={{
				textAlign: "left",
				overflow: "scroll",
				height: "calc(100vh - 150px)",
			}}
		>
			<Skeleton visible={false}>
				{list?.map((item) => {
					return (
						<ListItem
							selectedAppKey={selectedAppKey}
							setSelectedAppKey={setSelectedAppKey}
							app={item}
							key={item.key}
							deleteItem={deleteItem}
							editItem={editItem}
						/>
					);
				})}
			</Skeleton>
		</Card>
	);
};

// List.whyDidYouRender = true;
export default List;
