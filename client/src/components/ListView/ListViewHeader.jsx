import { ActionIcon, Text, TextInput, rem } from "@mantine/core";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { ICON } from "constants/icons";
import classes from "../MainView/MainView.module.css";

export const ListViewHeader = ({
	filteredApps,
	editItem,
	setFilter,
	...props
}) => {
	const { filter, theme } = props;
	return (
		<>
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
				Applications
			</Text>
			<ActionIcon
				title="Add application"
				onClick={(e) => editItem(null, false, true)}
				style={{
					width: rem(50),
					height: rem(50),
					position: "absolute",
					top: "33px",
					right: "24px",
					backgroundColor: "transparent",
				}}
			>
				<ICON.add
					style={{
						width: rem(50),
						height: rem(50),
					}}
					stroke={2}
					color={theme.colors.blue[6]}
				/>
			</ActionIcon>
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
			{filteredApps && <Text size="xs" style={{ textAlign: "left", margin: "10px 0 0 20px" }}>
				{filteredApps?.length} apps in total.
			</Text>}
		</>
	);
};
