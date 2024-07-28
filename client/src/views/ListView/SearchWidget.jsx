import { ActionIcon, Text, Tooltip, rem } from "@mantine/core";
import { IconFileText, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useClientManager } from "../../core/ClientManager";
import { rootStore } from "../../store/store";
import "components/neumorphic.css";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./SearchWidget.css";

const SearchWidget = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const { setSelectedAppKey } = useClientManager();

	const openApp = (key) => {
		console.log("Open app", key);
		setSelectedAppKey(key);
	};

	const handleOnSearch = (string, results) => {
		// console.log(string, results);
	};

	const handleOnHover = (result) => {
		// console.log(result);
	};

	const handleOnSelect = (item) => {
		openApp(item.key);
		setIsOpen(false);
	};

	const handleOnFocus = () => {
		console.log("Focused");
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
			<ActionIcon
				size="xl"
				style={{ position: "absolute", top: "25px", right: "120px" }}
				className="neubtn"
				onClick={() => setIsOpen(!isOpen)}
			>
				<Tooltip label="Free text search for apps" position="top">
					<IconSearch size={24} color="#999" />
				</Tooltip>
			</ActionIcon>
			{isOpen && (
				<div
					className="searchWidget"
					style={{
						zIndex: "99999",
					}}
				>
					<header className="searchWidgetHeader">
						<div style={{ width: 400 }}>
							<ReactSearchAutocomplete
								items={
									rootStore.get.appCollection()?.length &&
									rootStore.get.appCollection()
								}
								resultStringKeyName="name"
								onSearch={handleOnSearch}
								onHover={handleOnHover}
								onSelect={handleOnSelect}
								onFocus={handleOnFocus}
								autoFocus
								formatResult={formatResult}
								style={{ backgroundColor: "#222" }}
							/>
						</div>
					</header>
				</div>
			)}
		</ActionIcon.Group>
	);
};

export default SearchWidget;
