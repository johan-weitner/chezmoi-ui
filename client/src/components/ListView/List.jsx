import { useState } from "react";
import { Card, Skeleton } from "@mantine/core";
import { useEffect } from "react";
import { useClient } from "core/ClientProvider";
import classes from "components/MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListSkeleton } from "./ListSkeleton";

const List = (props) => {
	const [list, setList] = useState([]);
	const {
		pageContent,
		selectApp,
		deleteItem,
		updateItem,
		selectedAppKey,
		isLoading,
	} = useClient();
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
							selectApp={selectApp}
							selectedAppKey={selectedAppKey}
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

List.whyDidYouRender = true;
export default List;
