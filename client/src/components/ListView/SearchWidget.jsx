import { useEffect, useState } from "react";
import { rem, Button, ActionIcon, Tooltip } from "@mantine/core";
import { useClientManager } from "core/ClientProvider";
import { Spotlight, spotlight } from "@mantine/spotlight";

import {
	IconHome,
	IconDashboard,
	IconFileText,
	IconSearch,
} from "@tabler/icons-react";

const actions = [];
const SearchWidget = (props) => {
	const { allApps } = useClientManager();
	const [apps, setApps] = useState([]);

	const openApp = (key) => {
		selectApp(key);
	};

	useEffect(() => {
		if (allApps) {
			setApps(allApps);
			allApps.map((app) => {
				actions.push({
					id: app.key,
					label: app.name,
					description: app.short,
					onClick: () => openApp(app.key),
					leftSection: (
						<IconFileText
							style={{ width: rem(24), height: rem(24) }}
							stroke={1.5}
						/>
					),
				});
			});
		}
	}, [allApps]);

	return (
		<ActionIcon.Group>
			<ActionIcon onClick={spotlight.open} size="xl">
				<Tooltip label="Free text search for apps" position="top">
					<IconSearch size={24} />
				</Tooltip>
			</ActionIcon>
			<Spotlight
				actions={actions}
				nothingFound="Nothing found..."
				highlightQuery
				searchProps={{
					leftSection: (
						<IconSearch
							style={{ width: rem(20), height: rem(20) }}
							stroke={1.5}
						/>
					),
					placeholder: "Search apps...",
				}}
			/>
		</ActionIcon.Group>
	);
};

export default SearchWidget;
