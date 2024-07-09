import { Card, Skeleton } from "@mantine/core";
import { nanoid } from "nanoid";
import classes from "../MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListSkeleton } from "./ListSkeleton";

const List = (props) => {
	const { filteredApps, selectApp, selectedAppKey, error, loading } = props;
	const errorMsg = error ? <div>ERROR: {error.message || error}</div> : null;
	const skeleton = [];
	for (let i = 0; i < 20; i++) {
		skeleton.push(<ListSkeleton />);
	}

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
				{filteredApps?.length > 0 &&
					filteredApps.map((item) => {
						return (
							<ListItem
								selectApp={selectApp}
								selectedAppKey={selectedAppKey}
								app={item}
								key={nanoid()}
							/>
						);
					})}
			</Skeleton>
		</Card>
	);
};

export default List;
