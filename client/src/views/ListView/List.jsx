import React from "react";
import { Card, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useClientManager } from "core/ClientManager";
import { ListItem } from "./ListItem";
import classes from "./ListView.module.css";
import { useSelector } from "store/store";

const List = (props) => {
	const { deleteItem, editItem } = props;
	const pageContent = useSelector((state) => state.root.pageContent);
	const appCollection = useSelector((state) => state.root.appCollection);
	const isLoading = useSelector((state) => state.root.isLoading);
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

	const selectNewApp = (key) => {
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
					pageContent?.map((item) => {
						return (
							<ListItem
								setSelectedAppKey={selectNewApp}
								app={item}
								key={`${item.key}-${item.id}`}
								deleteItem={deleteItem}
								editItem={editItem}
								mainView={mainView}
								isSelected={selectedAppKey === item.key}
							/>
						);
					})}
				{currentFilter &&
					state.filteredList?.map((item) => {
						return (
							<ListItem
								setSelectedAppKey={selectNewApp}
								app={item}
								key={`${item.key}-${item.id}`}
								deleteItem={deleteItem}
								editItem={editItem}
								mainView={mainView}
								isSelected={selectedAppKey === item.key}
							/>
						);
					})}
			</Skeleton>
		</Card>
	);
};

List.whyDidYouRender = true;

export default List;
