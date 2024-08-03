import { Card, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { rootStore } from "store/store";
import { useClientManager } from "core/ClientManager";
import { ListItem } from "./ListItem";
import classes from "./ListView.module.css";
import { useSelector, useDispatch } from "react-redux";

const List = (props) => {
	const dispatch = useDispatch();
	const { deleteItem, editItem } = props;
	const selectedKey = useSelector((state) => state.root.selectedAppKey);
	const mainView = useSelector((state) => state.root.mainView);
	const [currentKey, setCurrentKey] = useState(selectedKey);
	const [currentFilter, setCurrentFilter] = useState(selectedKey);
	const { setSelectedAppKey, getPageContent } = useClientManager();

	const {
		appCollection,
		activeFilter,
		filteredList,
		selectedAppKey,
		pageContent,
		isLoading,
	} = useSelector((state) => state.root);

	useEffect(() => {
		getPageContent();
	}, [appCollection]);

	useEffect(() => {
		setCurrentKey(selectedAppKey);
	}, [selectedAppKey]);

	useEffect(() => {
		setCurrentFilter(activeFilter);
	}, [activeFilter]);

	const selectNewApp = (key) => {
		setCurrentKey(key);
		setSelectedAppKey(key);
	};

	return (
		<Card
			shadow="md"
			fz="sm"
			c="dimmed"
			mt="sm"
			className={classes.scrollContainer}
		>
			<Skeleton visible={isLoading}>
				{!currentFilter &&
					useSelector((state) => state.root.pageContent)?.map((item) => {
						return (
							<ListItem
								selectedAppKey={currentKey}
								setSelectedAppKey={selectNewApp}
								app={item}
								key={nanoid()}
								deleteItem={deleteItem}
								editItem={editItem}
								mainView={mainView}
							/>
						);
					})}
				{currentFilter &&
					// rootStore?.use?.filteredList()?.map((item) => {
					useSelector((state) => state.root.filteredList)?.map((item) => {
						return (
							<ListItem
								selectedAppKey={currentKey}
								setSelectedAppKey={selectNewApp}
								app={item}
								key={nanoid()}
								deleteItem={deleteItem}
								editItem={editItem}
								mainView={mainView}
							/>
						);
					})}
			</Skeleton>
		</Card>
	);
};

// List.whyDidYouRender = true;
export default List;
