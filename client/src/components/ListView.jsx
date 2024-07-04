import { Card } from "@mantine/core";
import { nanoid } from "nanoid";
import { useState } from "react";
import classes from "./MainView.module.css";
import { ListViewHeader } from "./ListViewHeader";
import { ListItem } from "./ListItem";
import { filterUnwantedNodes } from "utils/installDoctorFilter";


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
	const { software, theme, selectApp, selectedApp, editItem, deleteItem, edited } = props;

	const [filter, setFilter] = useState("");
	const purgedList = filterUnwantedNodes(software);;

	const listItemKeys = [];
	purgedList.map((item) => {
		listItemKeys.push(item);
	});

	const listItemNames = [];
	purgedList.map((item) => {
		listItemNames.push(software[item]._name);
	});

	const filteredApps = listItemKeys.filter((key) =>
		software[key]?._name?.toLowerCase().includes(filter?.toLowerCase()),
	);

	return (
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
				{filteredApps?.length > 0 &&
					filteredApps.map((item) => {
						return (
							<ListItem
								software={software}
								item={item}
								selectApp={selectApp}
								selectedApp={selectedApp}
								editItem={editItem}
								deleteItem={deleteItem}
								key={nanoid()}
								edited={edited.includes(item)}
							/>
						);
					})}
			</Card>
		</Card >
	);
};

export default ListView;
