import { Card, Pagination, Stack, Text } from "@mantine/core";
import { QueryClient } from "@tanstack/react-query";
import { getTotalCount, useAppPage } from "api/appCollectionApi";
import FallbackComponent from "components/FallbackComponent";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import classes from "../MainView/MainView.module.css";
import List from "./List";
import { ListViewHeader } from "./ListViewHeader";

const ListView = (props) => {
	const { theme, selectApp, selectedAppKey, setIsPopoverOpen, deleteItem } =
		props;
	const [filter, setFilter] = useState("");
	const [filteredApps, setFilteredApps] = useState(null);
	const [page, setPage] = useState();
	const [lastChange, setLastChange] = useState(new Date().getTime());
	const queryClient = new QueryClient();

	// const [error, setError] = useState();
	// const [isLoading, setIsLoading] = useState();

	const [numPages, setNumPages] = useState(1);
	const [totalCount, setTotalCount] = useState(1);

	const { data: software, error, isLoading } = useAppPage(page);
	// pageError && setError(pageError);
	// pageIsLoading && setIsLoading(pageIsLoading);

	const addItem = () => {
		console.log("Add");
		// selectApp(null);
		setIsPopoverOpen(true);
	};

	useEffect(() => {
		getTotalCount().then((response) => {
			const { count } = response;
			const pages = Math.ceil(count / 20);
			setNumPages(pages);
			setTotalCount(count);
		});
	}, []);

	useEffect(() => {
		const apps = software?.filter((item) => {
			return item?._name?.toLowerCase().includes(filter?.toLowerCase());
		});
		setFilteredApps(apps);
		queryClient.cancelQueries(["appCollection"]);
		queryClient.invalidateQueries(["appCollection"]);
	}, [page, lastChange, filter, software]);

	const deleteApp = (key) => {
		deleteItem(key);
		setLastChange(new Date().getTime());
		setFilteredApps(filteredApps.filter((item) => item.key !== key));
	};

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={classes.card} padding="xl">
				<p>Page {page}</p>
				<ListViewHeader
					filter={filter}
					filteredApps={filteredApps}
					theme={theme}
					setFilter={setFilter}
					addItem={addItem}
				/>
				<Stack justify="center" align="center" style={{ marginTop: "20px" }}>
					<Pagination
						total={numPages}
						gap={20}
						onChange={setPage}
						value={page}
					/>
					{filteredApps && (
						<Text
							size="xs"
							style={{ textAlign: "left", margin: "10px 0 0 20px" }}
						>
							{totalCount} apps in total.
						</Text>
					)}
				</Stack>
				<List
					filteredApps={filteredApps}
					selectApp={selectApp}
					selectedAppKey={selectedAppKey}
					error={error}
					loading={isLoading}
					deleteItem={deleteApp}
				/>
			</Card>
		</ErrorBoundary>
	);
};

export default ListView;
