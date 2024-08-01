import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { selectAppByKey } from "store/selectors";
import { rootStore } from "store/store";
import { useClientManager } from "core/ClientManager";
import GroupListItem from "./GroupListItem";
import classes from "../ListView/ListView.module.css";
import {
	Container,
	Group,
	rem,
	Text,
	SimpleGrid,
	ActionIcon,
	ThemeIcon,
	List,
	Card,
	Skeleton,
	Title,
} from "@mantine/core";
import "../../common.css";
import { IconPackages } from "@tabler/icons-react";
import s from "./GroupView.module.css";

const GroupList = (props) => {
	const selectedKey = rootStore.get.selectedGroupKey();
	const [currentKey, setCurrentKey] = useState(selectedKey);
	const { setSelectedGroupKey } = useClientManager();
	const [groups, setGroups] = useState(null);
	const [groupKeys, setGroupKeys] = useState(null);

	useEffect(() => {
		setGroups(rootStore.get.appGroups());
		setGroupKeys(rootStore.get.appGroupKeys());
	}, [rootStore.get.appGroups(), rootStore.get.appGroupKeys()]);

	const deleteItem = () => {};
	const editItem = () => {};

	useEffect(() => {
		setCurrentKey(rootStore.get.selectedGroupKey());
	}, [rootStore.use.selectedGroupKey()]);

	const selectNewGroup = (key) => {
		// console.log("Selecting group: ", key);
		setCurrentKey(key);
		setSelectedGroupKey(key);
	};

	return (
		<Card
			size="lg"
			shadow="lg"
			radius="md"
			padding="xl"
			ta="left"
			style={{
				backgroundColor: "#363636",
				border: "1px solid #222",
			}}
		>
			<Title
				fw="normal"
				ta="left"
				mb={30}
				style={{
					backgroundColor: "#252525",
					padding: "10px 20px",
					borderRadius: "10px",
					border: "1px solid #444",
					boxShadow: "10px 10px 30px rgba(0,0,0,0.3)",
				}}
			>
				Groups
			</Title>
			<List
				spacing="md"
				size="md"
				pl="3px"
				center
				icon={
					<ThemeIcon color="#007bff" size={24} radius="xl">
						<IconPackages style={{ width: rem(16), height: rem(16) }} />
					</ThemeIcon>
				}
			>
				{rootStore.use.appGroups()?.map((item) => {
					return (
						<List.Item
							mb={0}
							mt={0}
							key={nanoid()}
							className={s.listItem}
							onClick={() => selectNewGroup(item.id)}
						>
							{item.name}
						</List.Item>
					);
				})}
			</List>
		</Card>
	);

	// return (
	// 	<Card
	// 		shadow="md"
	// 		fz="sm"
	// 		c="dimmed"
	// 		mt="sm"
	// 		className={classes.scrollContainer}
	// 	>
	// 		<Skeleton visible={rootStore?.use?.isLoading()}>
	// 			{rootStore?.use?.appGroupKeys()?.map((item) => {
	// 				return (
	// 					<GroupListItem
	// 						selectedGroupKey={currentKey}
	// 						setSelectedGroupKey={selectNewGroup}
	// 						group={item}
	// 						key={nanoid()}
	// 						deleteItem={() => {}}
	// 						editItem={() => {}}
	// 					/>
	// 				);
	// 			})}
	// 		</Skeleton>
	// 	</Card>
	// );
};

// List.whyDidYouRender = true;
export default GroupList;
