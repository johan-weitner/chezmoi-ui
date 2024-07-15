import { Card, Skeleton, Text } from "@mantine/core";
import { useEffect } from "react";
import { toast } from "sonner";
import { useClientManager } from "../../core/ClientProvider";
import classes from "../MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListSkeleton } from "./ListSkeleton";

const List = (props) => {
	const { allApps, selectApp, deleteItem, updateItem, selectedAppKey } =
		useClientManager();
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
			{/* <Skeleton visible={loading}> */}
			{allApps?.map((item) => {
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
