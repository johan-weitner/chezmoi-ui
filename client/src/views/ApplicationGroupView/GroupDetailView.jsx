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
import { IconArrowLeft, IconPackages } from "@tabler/icons-react";
import StickyBox from "react-sticky-box";
import { rootStore } from "store/store";
import { nanoid } from "nanoid";
import s from "./GroupView.module.css";

const FallBack = () => {
	return (
		<Text size="sm" style={{ color: "#666" }}>
			[ Select a group in the list to the left ]
		</Text>
	);
};

const GroupDetailView = (props) => {
	const [currentList, setCurrentList] = useState(null);

	useEffect(() => {
		setCurrentList(rootStore.get.selectedGroup());
	}, [rootStore.get.selectedGroup()]);

	const getOutputString = (item) => {
		if (typeof item === "string") {
			return item.indexOf("_") === 0 ? (
				<b>Includes: {item.substring(1)}</b>
			) : (
				item
			);
		}
		return <span style={{ fontStyle: "italic", color: "#999" }}>[Array]</span>;
	};

	const onClickItem = (item) => {
		typeof item === "string" && item.indexOf("_") === 0
			? (item) => {
					rootStore.set.selectedGroupKey(item.substring(1));
				}
			: null;
	};

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
					{(rootStore.use.selectedGroup() && (
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
							{rootStore.get.selectedGroup().map((item) => {
								return (
									<List.Item
										mb={0}
										mt={0}
										key={nanoid()}
										className={s.listItem}
										onClick={(item) => onClickItem(item)}
									>
										{getOutputString(item)}
									</List.Item>
								);
							})}
						</List>
					)) || <FallBack />}
				</Card>
			</StickyBox>
		</Container>
	);
};

export default GroupDetailView;
