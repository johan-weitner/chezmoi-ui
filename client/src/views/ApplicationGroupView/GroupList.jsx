import { Card, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { selectAppByKey } from "store/selectors";
import { rootStore } from "store/store";
import { useClientManager } from "core/ClientManager";
import GroupListItem from "./GroupListItem";
import classes from "../ListView/ListView.module.css";

const List = (props) => {
	const { deleteItem, editItem } = props;
	const selectedKey = rootStore.get.selectedGroupKey();
	const [currentKey, setCurrentKey] = useState(selectedKey);
	const { setSelectedGroupKey } = useClientManager();

	useEffect(() => {
		setCurrentKey(rootStore.get.selectedGroupKey());
	}, [rootStore.use.selectedGroupKey()]);

	const selectNewGroup = (key) => {
		console.log("Selecting group: ", key);
		setCurrentKey(key);
		setSelectedGroupKey(key);
	};

	return (
		<Card
			shadow="md"
			fz="sm"
			c="dimmed"
			mt="sm"
			className={classes.scrollContainer}
		>
			<Skeleton visible={rootStore?.use?.isLoading()}>
				{rootStore?.use?.appGroupKeys()?.map((item) => {
					return (
						<GroupListItem
							selectedGroupKey={currentKey}
							setSelectedGroupKey={selectNewGroup}
							group={item}
							key={nanoid()}
							deleteItem={() => {}}
							editItem={() => {}}
						/>
					);
				})}
			</Skeleton>
		</Card>
	);
};

// List.whyDidYouRender = true;
export default List;
