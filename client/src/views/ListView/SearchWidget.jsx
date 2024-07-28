import { ActionIcon, Tooltip, rem } from "@mantine/core";
import { Spotlight, spotlight } from "@mantine/spotlight";
import { IconBox, IconSearch } from "@tabler/icons-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useClientManager } from "../../core/ClientManager";
import { rootStore } from "../../store/store";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "components/FallbackComponent";

import "components/neumorphic.css";

const SearchWidget = (props) => {
	const [data, setData] = useState([]);
	const { setSelectedAppKey, getSearchBase } = useClientManager();

	useEffect(() => {
		setData(getResultset());
	}, [rootStore.use.appCollection()]);

	const getResultset = useCallback(() => {
		const appCollection = getSearchBase();
		const data = [];
		console.log("appCollection: ", appCollection);
		appCollection?.map((app) => {
			data.push({
				...app,
				onClick: () => openApp(app.key),
				leftSection: (
					<IconBox style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
				),
			});
		});
		console.log("<<< Slimmed data set: ", data);
		return data;
	}, [rootStore.get.appCollection()]);

	const openApp = (key) => {
		setSelectedAppKey(key);
	};

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
			<ErrorBoundary
				fallbackRender={(error) => (
					<FallbackComponent error={error.message} style={{ width: "100%" }} />
				)}
			>
				{data && (
					<Spotlight
						actions={data}
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
				)}
			</ErrorBoundary>
		</ActionIcon.Group>
	);
};

export default SearchWidget;
