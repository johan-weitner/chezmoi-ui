import { Card } from "@mantine/core";
import { getApp, useAppCollection } from "api/appCollectionApi";
import { nanoid } from "nanoid";
import { useState } from "react";
import BarLoader from "react-spinners/BarLoader";
import DotLoader from "react-spinners/DotLoader";
import { ListItem } from "./ListItem";
import { ListViewHeader } from "./ListViewHeader";
import classes from "./MainView.module.css";

/**
 * Renders a list view component with a header and a scrollable list of items.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.software - An object containing software information.
 * @param {string} props.theme - The current theme.
 * @param {function} props.selectApp - A function to select an app.
 * @param {function} props.editItem - A function to edit an item.
 * @param {function} props.deleteItem - A function to delete an item.
 * @param {function} props.gotoNext - A function to navigate to the next page.
 * @returns {JSX.Element} The list view component.
 */
const ListView = (props) => {
	const { theme, selectApp } = props;
	const { data: software, error, isLoading } = useAppCollection();
	const [filter, setFilter] = useState("");
	const [selectedApp, setSelectedApp] = useState(null);

	const appKeys = Object.keys(software);
	const appNames = [];
	software &&
		Object.keys(software).map((item) => {
			appNames.push(software[item]?._name);
		});

	const filteredApps = appKeys?.filter((key) =>
		software[key]?._name?.toLowerCase().includes(filter?.toLowerCase()),
	);

	const editItem = () => { };
	const deleteItem = () => { };

	const loading = isLoading ? (
		<BarLoader
			loading={true}
			color="3391ff"
			size={150}
			cssOverride={{ bordser: "1px solid #933" }}
		/>
	) : null;

	const errorMsg = error ? <div>ERROR: {error.message || error}</div> : null;

	return (
		software && (
			<>
				<DotLoader
					loading={true}
					color="3391ff"
					size={150}
					cssOverride={{
						zIndex: "999999",
						position: "absolute",
						top: "100px",
						left: "400px",
					}}
				/>
				<Card shadow="md" radius="md" className={classes.card} padding="xl">
					<ListViewHeader
						filter={filter}
						filteredApps={filteredApps}
						theme={theme}
						editItem={editItem}
						setFilter={setFilter}
					/>
					<Card
						shadow="md"
						fz="sm"
						c="dimmed"
						mt="sm"
						className={classes.scrollContainer}
						style={{
							textAlign: "left",
							overflow: "scroll",
							height: "calc(100vh - 150px)",
						}}
					>
						{errorMsg}
						{filteredApps?.length > 0 &&
							filteredApps.map((item) => {
								return (
									<ListItem
										selectApp={selectApp}
										app={item}
										editItem={editItem}
										deleteItem={deleteItem}
										key={nanoid()}
									/>
								);
							})}
					</Card>
				</Card>
			</>
		)
	);
};

export default ListView;
