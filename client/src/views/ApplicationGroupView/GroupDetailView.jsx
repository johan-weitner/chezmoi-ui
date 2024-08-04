import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Text,
	rem,
	Container,
	Card,
	Title,
	List,
	ThemeIcon,
	ActionIcon,
	Tooltip,
} from "@mantine/core";
import { IconArrowLeft, IconPackages, IconTrash } from "@tabler/icons-react";
import StickyBox from "react-sticky-box";
import { rootStore } from "store/store";
import { nanoid } from "nanoid";
import s from "./GroupView.module.css";
import { useGroupManager } from "core/GroupManager";
import { getSelectedGroupId } from "store/selectors";
import { setSelectedGroupId } from "store/store";

const FallBack = () => {
	return (
		<Text size="sm" style={{ color: "#666" }}>
			[ Select a group in the list to the left ]
		</Text>
	);
};

const GroupDetailView = (props) => {
	const dispatch = useDispatch();
	const selectedGroup = useSelector((state) => state.root.selectedGroup);
	const { getAppsInGroup, kickAppFromGroup } = useGroupManager();
	const selectedGroupKey = useSelector((state) => state.root.selectedGroupKey);
	const selectedGroupId = useSelector((state) => state.root.selectedGroupId);
	const appsInSelectedGroup = useSelector(
		(state) => state.root.appsInSelectedGroup,
	);

	// useEffect(() => {
	// 	getAppsInGroup(selectedGroupId);
	// }, [selectedGroupKey]);

	return (
		<Container
			size="lg"
			ta="left"
			style={{
				backgroundColor: "#2e2e2e",
				width: "100%",
			}}
		>
			<StickyBox offsetTop={110}>
				<Card size="lg" shadow="lg" radius="md" padding="xl" ta="left">
					<Title fw="normal" ta="left" mb={30} className={s.groupTitle}>
						<Tooltip label="Return to group list - [BACKSPACE]">
							<ActionIcon
								size="xl"
								variant="light"
								mr={20}
								ml={-10}
								p={5}
								onClick={() => dispatch(setSelectedGroupId(null))}
								className={s.backBtn}
							>
								<IconArrowLeft size={28} />
							</ActionIcon>
						</Tooltip>
						{selectedGroup?.name}
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
						{appsInSelectedGroup?.map((item) => {
							return (
								<List.Item
									mb={0}
									mt={0}
									key={nanoid()}
									className={s.ulistItem}
									style={{ position: "relative" }}
								>
									{item.name}
									<Tooltip label="Remove app from group">
										<ActionIcon
											size="med"
											variant="light"
											p={5}
											onClick={() => kickAppFromGroup(selectedGroupId, item.id)}
											color="orange"
											className={s.deleteBtn}
										>
											<IconTrash size={28} />
										</ActionIcon>
									</Tooltip>
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
