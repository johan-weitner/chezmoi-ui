import {
	ActionIcon,
	Flex,
	Group,
	Menu,
	Text,
	Tooltip,
	rem,
	useMantineTheme,
} from "@mantine/core";
import { IconDownload, IconFilter, IconCirclePlus } from "@tabler/icons-react";
import { filterModel } from "api/filterApi";
import { ICON } from "constants/icons";
import { useClientManager } from "core/ClientManager";
import { useState } from "react";
import s from "./ListView.module.css";
import SearchWidget from "./SearchWidget";
import ExportFilter from "./ExportFilter";
import "components/neumorphic.css";
import { nanoid } from "nanoid";
import { log } from "utils/logger";
import { useSelector, store, setHideCompleted } from "store/store";

export const ListViewHeader = (props) => {
	const theme = useMantineTheme();
	const [exportIsOpen, setExportIsOpen] = useState(false);
	const { addItem, applyFilter, clearFilter, refreshAppCollection } =
		useClientManager();
	const activeFilter = useSelector((state) => state.root.activeFilter);
	const hideCompleted = useSelector((state) => state.root.hideCompleted);

	const removeFilter = () => {
		clearFilter();
		store.dispatch(setHideCompleted(false));
		refreshAppCollection(false);
	};

	const hideCompletedApps = () => {
		removeFilter();
		store.dispatch(setHideCompleted(true));
		refreshAppCollection(true);
	};

	const doFilter = (filter) => {
		store.dispatch(setHideCompleted(false));
		applyFilter(filter);
	};

	return (
		<>
			<Group className={s.cardTitleContainer}>
				<ICON.allApps
					style={{ width: rem(50), height: rem(50) }}
					stroke={2}
					color={theme.colors.blue[6]}
					className={s.cardTitleIcon}
				/>
				<Text fz="xl" fw={500} className={s.cardTitle} mt="md">
					Applications
				</Text>
			</Group>
			<Flex
				justify="flex-end"
				align="flex-end"
				gap="15"
				style={{
					position: "absolute",
					top: "20px",
					right: "20px",
				}}
			>
				<Tooltip label="Add new app" position="top">
					<ActionIcon
						variant="filled"
						aria-label="Add new app"
						size="xl"
						className="neubtn"
						onClick={() => addItem()}
					>
						<IconCirclePlus size={24} color="#999" />
					</ActionIcon>
				</Tooltip>
				<Menu
					shadow="md"
					width={250}
					offset={8}
					style={{ backgroundColor: "#222 !important" }}
				>
					<Menu.Target>
						<Tooltip label="Open filter menu" position="top">
							<ActionIcon
								variant="filled"
								aria-label="Open filter menu"
								size="xl"
								className="neubtn"
							>
								<IconFilter size={24} color="#999" />
							</ActionIcon>
						</Tooltip>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label style={{ fontWeight: "bold" }}>
							FILTER APPS ON:
						</Menu.Label>
						<Menu.Item
							onClick={() => removeFilter()}
							leftSection={<ICON.startOver size={16} />}
							style={{
								fontWeight: "bold",
								borderTop: "1px solid #444",
								borderBottom: "1px solid #444",
							}}
						>
							Restore filter
						</Menu.Item>
						<Menu.Item
							onClick={() => hideCompletedApps()}
							leftSection={<ICON.hide size={16} />}
							style={{
								fontWeight: "bold",
								borderTop: "1px solid #444",
								borderBottom: "1px solid #444",
							}}
						>
							Hide completed apps {hideCompleted ? <span> ✓</span> : null}
						</Menu.Item>
						{Object.keys(filterModel).map((key) => (
							<Menu.Item
								key={nanoid()}
								onClick={() => doFilter(key)}
								className={key === activeFilter ? s.active : null}
							>
								{filterModel[key].title}
								{key === activeFilter ? <span> ✓</span> : null}
							</Menu.Item>
						))}{" "}
					</Menu.Dropdown>
				</Menu>
				<SearchWidget />
				<Tooltip label="Export YAML file" position="top">
					<ActionIcon
						variant="filled"
						aria-label="Export YAML file"
						size="xl"
						className="neubtn"
						onClick={() => setExportIsOpen(true)}
					>
						<IconDownload size={24} color="#999" />
					</ActionIcon>
				</Tooltip>
			</Flex>
			{exportIsOpen && <ExportFilter setExportIsOpen={setExportIsOpen} />}
		</>
	);
};
