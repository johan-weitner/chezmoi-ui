import { useState } from "react";
import {
	ActionIcon,
	Button,
	Group,
	Menu,
	Text,
	TextInput,
	Tooltip,
	UnstyledButton,
	rem,
	useMantineTheme,
} from "@mantine/core";
import { filterModel } from "api/filters";
import { useClientManager } from "core/ClientManager";
import { ICON } from "constants/icons";
import { IconMenu2, IconFilter, IconDownload } from "@tabler/icons-react";
import commonCss from "./ListView.module.css";
import SearchWidget from "./SearchWidget";
// import css from "./ListView.module.css";

export const ListViewHeader = (props) => {
	const theme = useMantineTheme();
	const [useFilter, setUseFilter] = useState(null);
	const { applyFilter, clearFilter, selectAppByKey } = useClientManager();

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
			<Group>
				<Menu
					shadow="md"
					width={250}
					offset={8}
					style={{ position: "absolute", top: "40px", right: "50px" }}
				>
					<Menu.Target>
						<ActionIcon
							variant="filled"
							aria-label="Open filter menu"
							size="xl"
						>
							<Tooltip label="Open filter menu" position="top">
								<IconFilter size={24} />
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
								key={key}
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
			</Group>
		</>
	);
};
