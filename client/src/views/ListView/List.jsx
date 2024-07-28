import { Card, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { selectAppByKey } from "store/selectors";
import { rootStore } from "store/store";
import { useClientManager } from "../../core/ClientManager";
import { ListItem } from "./ListItem";
import classes from "./ListView.module.css";

const List = (props) => {
	const { deleteItem, editItem } = props;
	const selectedKey = rootStore.get.selectedAppKey();
	const [currentKey, setCurrentKey] = useState(selectedKey);
	const [activeFilter, setActiveFilter] = useState(selectedKey);
	const { setSelectedAppKey } = useClientManager();

	useEffect(() => {
		setCurrentKey(rootStore.get.selectedAppKey());
	}, [rootStore.use.selectedAppKey()]);

	useEffect(() => {
		setActiveFilter(rootStore.get.activeFilter());
	}, [rootStore.use.activeFilter()]);

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
