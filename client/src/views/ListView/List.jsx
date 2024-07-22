import { useState, useEffect } from "react";
import { Card, Skeleton } from "@mantine/core";
import classes from "./ListView.module.css";
import { ListItem } from "./ListItem";
import { ListSkeleton } from "./ListSkeleton";
import { rootStore } from "store/store";
import { selectAppByKey } from "store/selectors";

const List = (props) => {
	const { deleteItem, editItem } = props;
	const selectedKey = rootStore.get.selectedAppKey();
	const [currentKey, setCurrentKey] = useState(selectedKey);
	const [activeFilter, setActiveFilter] = useState(selectedKey);

	// rootStore.get.filteredList() === null &&

	useEffect(() => {
		setCurrentKey(rootStore.get.selectedAppKey());
	}, [rootStore.use.selectedAppKey()]);

	useEffect(() => {
		console.log("FilteredList: ", rootStore.get.filteredList());
		setActiveFilter(rootStore.get.activeFilter());
	}, [rootStore.use.activeFilter()]);

	const selectNewApp = (key) => {
		setCurrentKey(key);
		rootStore.set.selectedAppKey(key);
		rootStore.set.selectedApp(selectAppByKey(key));
	};

	const skeleton = Array(20);
	skeleton.fill(<ListSkeleton />, 0, 20);

	return (
		<Card
			shadow="md"
			fz="sm"
			c="dimmed"
			mt="sm"
			className={classes.scrollContainer}
		>
			<Skeleton visible={rootStore?.use?.isLoading()}>
				{!activeFilter &&
					rootStore?.use?.pageContent()?.map((item) => {
						return (
							<ListItem
								selectedAppKey={currentKey}
								setSelectedAppKey={selectNewApp}
								app={item}
								key={item.key}
								deleteItem={deleteItem}
								editItem={editItem}
							/>
						);
					})}
				{activeFilter &&
					rootStore?.use?.filteredList()?.map((item) => {
						return (
							<ListItem
								selectedAppKey={currentKey}
								setSelectedAppKey={selectNewApp}
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
