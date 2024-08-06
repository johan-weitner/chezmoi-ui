import React, { useCallback } from "react";
import { Card } from "@mantine/core";
import { useEffect, useState } from "react";
import { useClientManager } from "core/ClientManager";
import ListItem from "./ListItem";
import classes from "./ListView.module.css";
import { useSelector } from "store/store";

const List = (props) => {
	const { deleteItem, editItem } = props;
	const pageContent = useSelector((state) => state.root.pageContent);
	const filteredList = useSelector((state) => state.root.filteredList);
	const appCollection = useSelector((state) => state.root.appCollection);
	const activeFilter = useSelector((state) => state.root.activeFilter);
	const selectedAppKey = useSelector((state) => state.root.selectedAppKey);
	const selectedKey = useSelector((state) => state.root.selectedKey);
	const mainView = useSelector((state) => state.root.mainView);
	const [currentFilter, setCurrentFilter] = useState(selectedKey);
	const { setSelectedAppKey, getPageContent } = useClientManager();

	useEffect(() => {
		getPageContent();
	}, [appCollection]);

	useEffect(() => {}, [selectedAppKey]);

	useEffect(() => {
		setCurrentFilter(activeFilter);
	}, [activeFilter]);

	const selectNewApp = useCallback(
		(key) => {
			setSelectedAppKey(key);
		},
		[setSelectedAppKey],
	);

	const deleteListItem = useCallback(
		(key) => {
			deleteItem(key);
		},
		[setSelectedAppKey],
	);
	const editListItem = useCallback(
		(key) => {
			editItem(key);
		},
		[setSelectedAppKey],
	);

	return (
		<Card
			shadow="md"
			fz="sm"
			c="dimmed"
			mt="sm"
			className={classes.scrollContainer}
			data-testid="listContainer"
		>
			<Skeleton visible={rootStore?.use?.isLoading()}>
				{!activeFilter &&
					rootStore?.use?.pageContent()?.map((item) => {
						return (
							<ListItem
								selectedAppKey={currentKey}
								setSelectedAppKey={selectNewApp}
								app={item}
								key={nanoid()}
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
								key={nanoid()}
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
