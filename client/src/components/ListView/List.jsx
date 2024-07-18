import { useState } from "react";
import { Card, Skeleton } from "@mantine/core";
import { useEffect } from "react";
import { useClientManager } from "core/ClientProvider";
import { useStore } from "store/rootState";
import classes from "components/MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListSkeleton } from "./ListSkeleton";

const List = (props) => {
	const { feed } = props;
	const [list, setList] = useState([]);
	const { deleteItem, updateItem } = useClientManager();
	const { pageContent, setSelectedAppKey, selectedAppKey, isLoading } =
		useStore();
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

List.whyDidYouRender = true;
export default List;
