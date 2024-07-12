import { Card, Skeleton, Text } from "@mantine/core";
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
	const errorMsg = error ? <div>ERROR: {error.message || error}</div> : null;
	// const skeleton = [];
	// for (let i = 0; i < 20; i++) {
	// 	skeleton.push(<ListSkeleton />);
	// }
	const skeleton = Array(20);
	skeleton.fill(<ListSkeleton />, 0, 20);

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
			{/* <Skeleton visible={loading}> */}
			{filteredApps?.map((item) => {
				return (
					<ListItem
						selectApp={selectApp}
						selectedAppKey={selectedAppKey}
						app={item}
						key={item}
						deleteItem={deleteApp}
					/>
				);
			})}
			{/* </Skeleton> */}
		</Card>
	);
};

export default List;
