import { Card, Skeleton } from "@mantine/core";
import classes from "views/MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListSkeleton } from "./ListSkeleton";

const List = (props) => {
	const {
		pageContent,
		isLoading,
		selectedAppKey,
		setSelectedAppKey,
		deleteItem,
		editItem,
	} = props;

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
			<Skeleton visible={isLoading}>
				{pageContent?.map((item) => {
					return (
						<ListItem
							selectedAppKey={selectedAppKey}
							setSelectedAppKey={setSelectedAppKey}
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

List.whyDidYouRender = true;
export default List;
