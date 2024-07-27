import { ActionIcon, Tooltip, rem } from "@mantine/core";
import { Spotlight, spotlight } from "@mantine/spotlight";
import { IconFileText, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useClientManager } from "../../core/ClientManager";
import { rootStore } from "../../store/store";
import "components/neumorphic.css";

const actions = [];
const SearchWidget = (props) => {
	const { setSelectedAppKey } = useClientManager();

	const openApp = (key) => {
		setSelectedAppKey(key);
	};

	useEffect(() => {
		const appCollection = rootStore.get.appCollection();
		appCollection?.map((app) => {
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
	}, [rootStore.use.appCollection()]);

	return (
		<ActionIcon.Group>
			<ActionIcon
				onClick={spotlight.open}
				size="xl"
				style={{ position: "absolute", top: "25px", right: "120px" }}
				className="neubtn"
			>
				<Tooltip label="Free text search for apps" position="top">
					<IconSearch size={24} color="#999" />
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
