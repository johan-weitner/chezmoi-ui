import { Card } from "@mantine/core";
import { nanoid } from "nanoid";
import { useState } from "react";
import {
	useQuery,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'
import classes from "./MainView.module.css";
import { ListViewHeader } from "./ListViewHeader";
import { ListItem } from "./ListItem";


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

	const getAppCollection = (arg) => {
		console.log('getAppCollection');
	};

	const getAppKeys = () => {
		return Object.keys(software);
	};

	const appCollectionQuery = useQuery({ queryKey: ['appCollection'], queryFn: getAppCollection });
	const appKeysQuery = useQuery({ queryKey: ['appKeys'], queryFn: getAppKeys });
	const appCollection = appCollectionQuery.data;
	const appKeys = appKeysQuery.data;
	console.log('appCollection', appCollection);
	console.log('appKeys', appKeys);

	const [filter, setFilter] = useState("");

	const appNames = [];
	Object.keys(software).map((item) => {
		appNames.push(software[item]?._name);
	});

	const filteredApps = appKeys?.filter((key) =>
		software[key]?._name?.toLowerCase().includes(filter?.toLowerCase()),
	);

	return appCollection && (
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
								edited={edited}
							/>
						);
					})}
			</Card>
		</Card >
	);
};

export default ListView;
