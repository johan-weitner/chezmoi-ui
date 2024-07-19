import { useState } from "react";
import { Card, Skeleton } from "@mantine/core";
import { useEffect } from "react";
import classes from "views/MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListSkeleton } from "./ListSkeleton";
import { memoizedSelectPage } from "core/Selectors";

const List = (props) => {
	const { bootstrapClient } = useClientManager();
	const [list, setList] = useState([]);
	useEffect(() => {
		bootstrapClient();
	}, []);
	const {
		store,
		deleteItem,
		updateItem,
		// pageContent,
		setSelectedAppKey,
		selectedAppKey,
		isLoading,
	} = useClientManager();
	const pageContent = memoizedSelectPage(store);

	const skeleton = Array(20);
	skeleton.fill(<ListSkeleton />, 0, 20);

	useEffect(() => {
		console.log("PageContent:", pageContent);
		if (!Array.isArray(pageContent)) {
			console.warn("PageContent is not an array");
			return;
		}
		setList(pageContent);
	}, [pageContent]);

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
			<Skeleton visible={isLoading}>
				{list?.map((item) => {
					return (
						<ListItem
							selectedAppKey={selectedAppKey}
							setSelectedAppKey={setSelectedAppKey}
							app={item}
							key={item.key}
							deleteItem={deleteItem}
							editItem={updateItem}
						/>
					);
				})}
			</Skeleton>
		</Card>
	);
};

// List.whyDidYouRender = true;
export default List;
