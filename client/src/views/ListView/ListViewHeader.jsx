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
import { IconDownload, IconFilter, IconMenu2 } from "@tabler/icons-react";
import { filterModel } from "api/filters";
import NeuButton from "components/NeuButton";
import { ICON } from "constants/icons";
import { useClientManager } from "core/ClientManager";
import { useState } from "react";
import commonCss from "./ListView.module.css";
import SearchWidget from "./SearchWidget";
import "components/neumorphic.css";
import { nanoid } from "nanoid";

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
					style={{ position: "absolute", top: "25px", right: "50px" }}
				>
					<Menu.Target>
						<ActionIcon
							variant="filled"
							aria-label="Open filter menu"
							size="xl"
							className="neubtn"
							data-testid="filterMenuButton"
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
							data-testid="clearFilterMenuItem"
						>
							Restore filter
						</Menu.Item>
						{Object.keys(filterModel).map((key) => (
							<Menu.Item
								key={nanoid()}
								onClick={() => applyFilter(key)}
								className={key === useFilter ? css.active : null}
								data-testid={`$(key)FilterMenuItem`}
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
