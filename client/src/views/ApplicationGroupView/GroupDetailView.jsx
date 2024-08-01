import { useState, useEffect } from "react";
import {
	Text,
	rem,
	Container,
	Card,
	Title,
	List,
	ThemeIcon,
	ActionIcon,
} from "@mantine/core";
import {
	IconArrowLeft,
	IconPackages,
	IconX,
	IconCircleX,
	IconTrash,
} from "@tabler/icons-react";
import StickyBox from "react-sticky-box";
import { rootStore } from "store/store";
import { nanoid } from "nanoid";
import s from "./GroupView.module.css";
import { useGroupManager } from "../../core/GroupManager";
import { getSelectedGroupId } from "../../store/selectors";

const FallBack = () => {
	return (
		<Text size="sm" style={{ color: "#666" }}>
			[ Select a group in the list to the left ]
		</Text>
	);
};

const GroupDetailView = (props) => {
	const { getAppsInGroup, kickAppFromGroup } = useGroupManager();

	useEffect(() => {
		getAppsInGroup(getSelectedGroupId());
	}, [rootStore.get.selectedGroupKey()]);

	return (
		<Container
			size="lg"
			ta="left"
			style={{
				backgroundColor: "#2e2e2e",
				width: "100%",
			}}
		>
			<StickyBox offsetTop={0} offsetBottom={0}>
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
					<Title fw="normal" ta="left" mb={30} className={s.groupTitle}>
						<ActionIcon
							size="xl"
							variant="light"
							mr={20}
							ml={-10}
							p={5}
							onClick={() => rootStore.set.selectedGroupKey(null)}
							className={s.backBtn}
						>
							<IconArrowLeft size={28} />
						</ActionIcon>
						{rootStore.get.selectedGroupKey()}
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
						{rootStore.use.appsInSelectedGroup()?.map((item) => {
							return (
								<List.Item
									mb={0}
									mt={0}
									key={nanoid()}
									className={s.ulistItem}
									style={{ position: "relative" }}
								>
									{item.name}
									<ActionIcon
										size="med"
										variant="light"
										p={5}
										onClick={() =>
											kickAppFromGroup(rootStore.get.selectedGroupId(), item.id)
										}
										color="orange"
										className={s.deleteBtn}
									>
										<IconTrash size={28} />
									</ActionIcon>
								</List.Item>
							);
						})}
					</List>
				</Card>
			</StickyBox>
		</Container>
	);
};

export default GroupDetailView;
