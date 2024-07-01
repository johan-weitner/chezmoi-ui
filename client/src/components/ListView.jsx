import { ActionIcon, Card, Text, TextInput, rem } from "@mantine/core";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { ICON } from "../constants/icons";
import classes from "./MainView.module.css";

const ListView = (props) => {
	const { software, theme, selectApp, editItem, deleteItem, gotoNext } = props;

	const [filter, setFilter] = useState("");
	// Strip metadata nodes from Install.Doctor list
	const unwanted = [
		"_envchain:deps",
		"_kde",
		"_misc-flatpaks",
		"_nautilus-extensions",
	];

	const purgedList = Object.keys(software).filter(
		(item) => !unwanted.includes(item),
	);

	const listItemKeys = [];
	purgedList.map((item) => {
		listItemKeys.push(item);
	});
	const listItemNames = [];
	purgedList.map((item) => {
		listItemNames.push(software[item]._name);
	});

	const filteredApps = listItemKeys.filter((key) =>
		software[key]?._name?.toLowerCase().includes(filter?.toLowerCase()),
	);

	return (
		<Card shadow="md" radius="md" className={classes.card} padding="xl">
			<ICON.allApps
				style={{ width: rem(50), height: rem(50) }}
				stroke={2}
				color={theme.colors.blue[6]}
			/>
			<Text
				fz="lg"
				fw={500}
				className={classes.cardTitle}
				mt="md"
				style={{ textAlign: "left", marginBottom: "30px" }}
			>
				Merged list
			</Text>
			<TextInput
				radius="xl"
				size="lg"
				placeholder="Filter by name"
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				style={{ margin: "0 14px", backgroundColor: "#262a2b" }}
				rightSectionWidth={42}
				leftSection={
					<IconSearch
						style={{ width: rem(18), height: rem(18) }}
						stroke={1.5}
					/>
				}
				rightSection={
					<ActionIcon
						size={32}
						radius="xl"
						color={theme.primaryColor}
						variant="filled"
					>
						<IconArrowRight
							style={{ width: rem(18), height: rem(18) }}
							stroke={1.5}
						/>
					</ActionIcon>
				}
				{...props}
			/>
			<Text size="xs" style={{ textAlign: "left", margin: "10px 0 0 20px" }}>
				{filteredApps.length} apps in total.
			</Text>
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
				{filteredApps?.length > 0 &&
					filteredApps.map((item) => {
						return (
							<div
								style={{ position: "relative", width: "100%" }}
								key={nanoid()}
							>
								<button
									className={classes.itemBox}
									onClick={(e) => selectApp(e, item)}
									style={{ width: "100%" }}
									type="button"
								>
									{software[item]._name}
								</button>
								<ICON.edit
									style={{
										width: rem(20),
										height: rem(20),
										position: "absolute",
										right: "50px",
										top: "14px",
										cursor: "pointer",
									}}
									stroke={2}
									color="white"
									onClick={() => editItem(item, true)}
								/>
								<ICON.remove
									style={{
										width: rem(20),
										height: rem(20),
										position: "absolute",
										right: "20px",
										top: "14px",
										cursor: "pointer",
									}}
									stroke={2}
									color="white"
									onClick={() => deleteItem(item)}
								/>
							</div>
						);
					})}
			</Card>
		</Card>
	);
};

export default ListView;
