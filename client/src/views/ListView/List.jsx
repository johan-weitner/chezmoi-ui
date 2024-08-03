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
	const selectedKey = rootStore.get.selectedAppKey();
	const [currentKey, setCurrentKey] = useState(selectedKey);
	const [activeFilter, setActiveFilter] = useState(selectedKey);
	const { setSelectedAppKey, getPageContent } = useClientManager();

	useEffect(() => {
		getPageContent();
	}, [useSelector((state) => state.root.appCollection)]);

	useEffect(() => {
		setCurrentKey(rootStore.get.selectedAppKey());
	}, [useSelector((state) => state.root.selectedAppKey)]);

	useEffect(() => {
		setActiveFilter(rootStore.get.activeFilter());
	}, [useSelector((state) => state.root.activeFilter)]);

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
			<Skeleton visible={rootStore?.use?.isLoading()}>
				{!activeFilter &&
					useSelector((state) => state.root.pageContent)?.map((item) => {
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
					// rootStore?.use?.filteredList()?.map((item) => {
					useSelector((state) => state.root.filteredList)
						?.filteredList()
						?.map((item) => {
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
