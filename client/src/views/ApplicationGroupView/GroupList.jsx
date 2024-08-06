import { useSelector } from "store/store";
import { nanoid } from "nanoid";
import { rem, ThemeIcon, List, Card, Title } from "@mantine/core";
import "../../common.css";
import { IconPackages } from "@tabler/icons-react";
import s from "./GroupView.module.css";
import { useGroupManager } from "core/GroupManager";

const GroupList = (props) => {
	const { selectGroup } = useGroupManager();
	const appGroups = useSelector((state) => state.root.appGroups);

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
				{appGroups?.map((item) => {
					return (
						<List.Item
							mb={0}
							mt={0}
							key={nanoid()}
							className={s.listItem}
							onClick={() => selectGroup(item.id)}
						>
							{item.name}
						</List.Item>
					);
				})}
			</List>
		</Card>
	);
};

// List.whyDidYouRender = true;
export default GroupList;
