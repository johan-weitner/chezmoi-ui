import { useState, useEffect } from "react";
import { Card, Skeleton } from "@mantine/core";
import classes from "views/MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListSkeleton } from "./ListSkeleton";
import { rootStore } from "store/store";

const List = (props) => {
	const { deleteItem, editItem } = props;
	const selectedKey = rootStore.get.selectedAppKey();
	const [currentKey, setCurrentKey] = useState(selectedKey);

	useEffect(() => {
		setCurrentKey(rootStore.get.selectedAppKey());
	}, [rootStore.use.selectedAppKey()]);

	const selectNewApp = (key) => {
		setCurrentKey(key);
		rootStore.set.selectedAppKey(key);
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
			style={{
				textAlign: "left",
				overflow: "scroll",
				height: "calc(100vh - 150px)",
			}}
		>
			<Skeleton visible={rootStore?.use?.isLoading()}>
				{rootStore?.use?.pageContent()?.map((item) => {
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
