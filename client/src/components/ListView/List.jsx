import { useState } from "react";
import { Card, Skeleton, Text } from "@mantine/core";
import { useEffect } from "react";
import { toast } from "sonner";
import { useClient } from "core/ClientProvider";
import classes from "components/MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListSkeleton } from "./ListSkeleton";
import { set } from "react-hook-form";

const List = (props) => {
	const [list, setList] = useState([]);
	const {
		page,
		pageContent,
		selectApp,
		deleteItem,
		updateItem,
		selectedAppKey,
	} = useClient();
	const skeleton = Array(20);
	skeleton.fill(<ListSkeleton />, 0, 20);

	useEffect(() => {
		console.log("Re-rendering...");
		setList(pageContent);
	}, [page, pageContent]);

	useEffect(() => {
		console.log("Page content: ", pageContent);
	}, [page, pageContent]);

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
			{/* <Skeleton visible={loading}> */}
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
			{/* </Skeleton> */}
		</Card>
	);
};

export default List;
