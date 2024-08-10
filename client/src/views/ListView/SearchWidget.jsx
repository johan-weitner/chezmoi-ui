import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useClickOutside } from "@mantine/hooks";
import { useClientManager } from "core/ClientManager";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "components/FallbackComponent";
import { useDispatch } from "react-redux";
import { useSelector } from "store/store";
import { log } from "utils/logger";

import "components/neumorphic.css";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./SearchWidget.css";

const SearchWidget = (props) => {
	const { groupView } = props;
	const [isOpen, setIsOpen] = useState(groupView);
	const ref = useClickOutside(() => setIsOpen(false));
	const { setSelectedAppKey } = useClientManager();
	const appCollection = useSelector((state) => state.root.appCollection);
	useHotkeys("alt + f", () => setIsOpen(true));

	const openApp = (key) => {
		log.debug("Open app", key);
		setSelectedAppKey(key);
	};

	const handleOnSelect = (item) => {
		openApp(item.key);
		setIsOpen(false);
	};

	const handleOnFocus = () => {
		log.debug("Focused");
	};

	const styling = {
		height: "50px",
		border: "1px solid #111",
		borderRadius: "24px",
		backgroundColor: "#222",
		boxShadow: "rgba(32, 33, 36, 0.28) 0px 1px 6px 0px",
		hoverBackgroundColor: "#333",
		color: "#FFF",
		fontSize: "16px",
		fontFamily: "Arial",
		iconColor: "grey",
		lineColor: "#111",
		placeholderColor: "grey",
		clearIconMargin: "3px 14px 0 0",
		searchIconMargin: "0 0 0 16px",
	};

	const formatResult = (item) => {
		return (
			<Text
				style={{ color: "#1769b3", display: "block", textAlign: "left" }}
				onClick={() => openApp(item.key)}
				fw="bold"
			>
				{item.name}
			</Text>
		);
	};

	return (
		<ActionIcon.Group>
			{!groupView && (
				<Tooltip label="Free text search for apps" position="top">
					<ActionIcon
						size="xl"
						className="neubtn"
						onClick={() => setIsOpen(!isOpen)}
					>
						<IconSearch size={24} color="#999" />
					</ActionIcon>
				</Tooltip>
			)}
			{isOpen && (
				<div
					className="searchWidget"
					style={{
						zIndex: "99999",
					}}
					ref={ref}
				>
					<ErrorBoundary
						fallbackRender={(error) => (
							<FallbackComponent error={error.message} />
						)}
					>
						<header className="searchWidgetHeader">
							<div style={{ width: 500 }}>
								<ReactSearchAutocomplete
									items={appCollection?.length && appCollection}
									styling={styling}
									resultStringKeyName="name"
									onSelect={handleOnSelect}
									autoFocus
									formatResult={formatResult}
								/>
							</div>
						</header>
					</ErrorBoundary>
				</div>
			)}
		</ActionIcon.Group>
	);
};

export default SearchWidget;
