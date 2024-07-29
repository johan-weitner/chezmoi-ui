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
import { useClickOutside } from "@mantine/hooks";
import { rootStore } from "store/store";
import { filterModel } from "api/filters";
import NeuButton from "components/NeuButton";
import { ICON } from "constants/icons";
import { useClientManager } from "core/ClientManager";
import { useState } from "react";
import commonCss from "./ListView.module.css";
import SearchWidget from "./SearchWidget";
import ExportFilter from "./ExportFilter";
import "components/neumorphic.css";
import { nanoid } from "nanoid";

export const ListViewHeader = (props) => {
	const theme = useMantineTheme();
	const [useFilter, setUseFilter] = useState(null);
	const [exportIsOpen, setExportIsOpen] = useState(false);
	const ref = useClickOutside(() => setExportIsOpen(false));

	const { addItem, applyFilter, clearFilter, getAppTags } = useClientManager();

	const tags = getAppTags();

	const handleChange = (tagId, isChecked) => {
		console.log("Tag", tagId, isChecked);
	};

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
				<ActionIcon
					variant="filled"
					aria-label="Open filter menu"
					size="xl"
					className="neubtn"
					onClick={() => addItem()}
				>
					<Tooltip label="Add new app" position="top">
						<IconCirclePlus size={24} color="#999" />
					</Tooltip>
				</ActionIcon>
				<Menu shadow="md" width={250} offset={8}>
					<Menu.Target>
						<ActionIcon
							variant="filled"
							aria-label="Open filter menu"
							size="xl"
							className="neubtn"
						>
							<Tooltip label="Open filter menu" position="top">
								<IconFilter size={24} color="#999" />
							</Tooltip>
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label style={{ fontWeight: "bold" }}>
							FILTER APPS ON:
						</Menu.Label>
						<Menu.Item
							onClick={() => clearFilter()}
							leftSection={<ICON.startOver size={16} />}
							style={{
								fontWeight: "bold",
								borderTop: "1px solid #444",
								borderBottom: "1px solid #444",
							}}
						>
							Restore filter
						</Menu.Item>
						{Object.keys(filterModel).map((key) => (
							<Menu.Item
								key={nanoid()}
								onClick={() => applyFilter(key)}
								className={key === useFilter ? css.active : null}
							>
								{filterModel[key].title}
								{key === useFilter ? <span> ✓</span> : null}
							</Menu.Item>
						))}
					</Menu.Dropdown>
				</Menu>
				<SearchWidget />
				<ActionIcon
					variant="filled"
					aria-label="Export YAML file"
					size="xl"
					className="neubtn"
					onClick={() => setExportIsOpen(true)}
				>
					<Tooltip label="Add new app" position="top">
						<IconDownload size={24} color="#999" />
					</Tooltip>
				</ActionIcon>
			</Flex>
			{exportIsOpen && <ExportFilter setExportIsOpen={setExportIsOpen} />}
		</>
	);
};
