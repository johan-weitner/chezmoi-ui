import { Card } from "@mantine/core";
import { useAppCollection } from "api/appCollectionApi";
import FallbackComponent from "components/FallbackComponent";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import BarSpinner from "../BarSpinner";
import classes from "../MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListViewHeader } from "./ListViewHeader";

const ListView = (props) => {
	const { theme, selectApp, selectedAppKey } = props;
	const { data: software, error, isLoading } = useAppCollection();
	const [filter, setFilter] = useState("");

	useEffect(() => {
		// console.log('SelectedAppKey changed: ', selectedAppKey);
	}, []);

	const appKeys = Object.keys(software);

	const filteredApps = appKeys?.filter((key) =>
		software[key]?._name?.toLowerCase().includes(filter?.toLowerCase()),
	);

	const loading = isLoading ? <BarSpinner /> : null;
	const errorMsg = error ? <div>ERROR: {error.message || error}</div> : null;

	return (
		software && (
			<ErrorBoundary
				fallbackRender={(error) => <FallbackComponent error={error.message} />}
			>
				{loading}
				<Card shadow="md" radius="md" className={classes.card} padding="xl">
					<ListViewHeader
						filter={filter}
						filteredApps={filteredApps}
						theme={theme}
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
										selectedAppKey={selectedAppKey}
										app={software[item]}
										key={nanoid()}
									/>
								);
							})}
					</Card>
				</Card>
			</ErrorBoundary>
		)
	);
};

export default ListView;
