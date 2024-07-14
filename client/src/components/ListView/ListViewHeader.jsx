import {
	ActionIcon,
	Group,
	Text,
	TextInput,
	Tooltip,
	UnstyledButton,
	rem,
	Menu,
	Button,
} from "@mantine/core";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { ICON } from "constants/icons";
import commonCss from "../MainView/MainView.module.css";
import Toolbar from "../Toolbar";
import css from "./ListView.module.css";

export const ListViewHeader = ({
	filteredApps,
	addItem,
	editItem,
	deleteItem,
	setFilter,
	runFilter,
	restoreFilters,
	...props
}) => {
	const { filter, theme } = props;
	return (
		<>
			<Group className={commonCss.cardTitleContainer}>
				<ICON.allApps
					style={{ width: rem(50), height: rem(50) }}
					stroke={2}
					color={theme.colors.blue[6]}
					className={commonCss.cardTitleIcon}
				/>
				<Text fz="xl" fw={500} className={commonCss.cardTitle} mt="md">
					Applications
				</Text>
				<Menu shadow="md" width={250}>
					<Menu.Target>
						<Button>Toggle menu</Button>
					</Menu.Target>
 					<Menu.Divider />
					<Menu.Dropdown>
						<Menu.Label>FILTER APPS ON:</Menu.Label>

						<Menu.Item>
							<UnstyledButton onClick={() => restoreFilters()}>
								Restore filter
							</UnstyledButton>
						</Menu.Item>
						<Menu.Item>
							<UnstyledButton onClick={() => runFilter("noInstallers")}>
								Apps without installers
							</UnstyledButton>
						</Menu.Item>
						<Menu.Item>
							<UnstyledButton onClick={() => runFilter("noUrls")}>
								Apps without URLs
							</UnstyledButton>
						</Menu.Item>
						<Menu.Item>
							<UnstyledButton onClick={() => runFilter("noName")}>
								Apps without name
							</UnstyledButton>
						</Menu.Item>
						<Menu.Item>
							<UnstyledButton onClick={() => runFilter("noDesc")}>
								Apps without description
							</UnstyledButton>
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
				{/* <nav className={commonCss.colButtons}>
					<Tooltip
						label="Add application"
						position="bottom"
						transitionProps={{ duration: 0 }}
					>
						<UnstyledButton
							onClick={() => onClick(() => addItem())}
							className={commonCss.link}
						>
							<ICON.add
								style={{ width: rem(20), height: rem(20) }}
								stroke={1.5}
								className={commonCss.linkButtonIcon}
							/>
						</UnstyledButton>
					</Tooltip>
					<Tooltip
						label="Delete application"
						position="bottom"
						transitionProps={{ duration: 0 }}
					>
						<UnstyledButton
							onClick={() => onClick(() => addItem())}
							className={commonCss.link}
						>
							<ICON.remove
								style={{ width: rem(20), height: rem(20) }}
								stroke={1.5}
								className={commonCss.linkButtonIcon}
							/>
						</UnstyledButton>
					</Tooltip>
				</nav> */}
			</Group>

			{/* <ActionIcon
				title="Add application"
				onClick={(e) => addItem()}
				style={{
					width: rem(50),
					height: rem(50),
				}}
				className={css.cardTitleAddIcon}
			>
				<ICON.add
					style={{
						width: rem(50),
						height: rem(50),
					}}
					stroke={2}
					color={theme.colors.blue[6]}
				/>
			</ActionIcon> */}

			{/* <TextInput
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
			/> */}
		</>
	);
};
