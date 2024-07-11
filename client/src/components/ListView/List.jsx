import { Card, Skeleton } from "@mantine/core";
import { deleteApp } from "api/appCollectionApi";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import classes from "../MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListSkeleton } from "./ListSkeleton";

const List = (props) => {
	const {
		filteredApps,
		selectApp,
		selectedAppKey,
		error,
		loading,
		deleteItem,
	} = props;
	const [apps, setApps] = useState(filteredApps);
	const errorMsg = error ? <div>ERROR: {error.message || error}</div> : null;
	const skeleton = [];
	for (let i = 0; i < 20; i++) {
		skeleton.push(<ListSkeleton />);
	}

	useEffect(() => {
		setApps(filteredApps);
	}, [filteredApps]);

	const deleteApp = (key) => {
		console.log("Deleting app with key: ", key);
		deleteItem(key);
		setApps(filteredApps.filter((item) => item.key !== key));
	};

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
			{errorMsg}
			<Skeleton visible={loading}>
				{apps?.length > 0 &&
					apps.map((item) => {
						return (
							<ListItem
								selectApp={selectApp}
								selectedAppKey={selectedAppKey}
								app={item}
								key={nanoid()}
								deleteItem={deleteApp}
							/>
						);
					})}
			</Skeleton>
		</Card>
	);
};

export default List;
