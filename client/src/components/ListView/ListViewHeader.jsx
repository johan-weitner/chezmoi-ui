import { useContext, useState } from "react";
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
	useMantineTheme,
} from "@mantine/core";
import { IconArrowRight, IconSearch, IconMenu2 } from "@tabler/icons-react";
import { useClient } from "core/ClientProvider";
import { filterModel } from "api/filters";
import { ICON } from "constants/icons";
import commonCss from "components/MainView/MainView.module.css";
import Toolbar from "../Toolbar";
import SearchWidget from "./SearchWidget";
import css from "./ListView.module.css";

export const ListViewHeader = (props) => {
	const { selectApp, applyFilter, restoreFilters, activeFilter } = useClient();

	const theme = useMantineTheme();

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
			<Group>
				<Menu shadow="md" width={250}>
					<Menu.Target>
						<ActionIcon
							variant="filled"
							aria-label="Open filter menu"
							size="xl"
						>
							<Tooltip label="Open filter menu" position="top">
								<IconMenu2 size={24} />
							</Tooltip>
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>FILTER APPS ON:</Menu.Label>
						<Menu.Item
							onClick={() => restoreFilters()}
							leftSection={<ICON.startOver size={16} />}
						>
							Restore filter
						</Menu.Item>
						{Object.keys(filterModel).map((key) => (
							<Menu.Item
								key={key}
								onClick={() => applyFilter(key)}
								className={key === activeFilter ? css.active : null}
							>
								{filterModel[key].title}
								{key === activeFilter ? <span> ✓</span> : null}
							</Menu.Item>
						))}
					</Menu.Dropdown>
				</Menu>
				<SearchWidget selectApp={selectApp} />
			</Group>
		</>
	);
};
