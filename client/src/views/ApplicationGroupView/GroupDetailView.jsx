import { useDispatch } from "react-redux";
import { useSelector } from "store/store";
import {
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
import { nanoid } from "nanoid";
import s from "./GroupView.module.css";
import { useClientManager } from "core/ClientManager";
import { setSelectedGroupId } from "store/store";

const GroupDetailView = (props) => {
	const dispatch = useDispatch();
	const selectedGroup = useSelector((state) => state.root.selectedGroup);
	const { Application } = selectedGroup ? selectedGroup : [];
	const { dropAppFromGroup } = useClientManager();
	const selectedGroupId = useSelector((state) => state.root.selectedGroupId);

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
						{Application?.map((item) => {
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
											onClick={() => dropAppFromGroup(selectedGroupId, item.id)}
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
