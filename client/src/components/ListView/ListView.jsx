import { Card, Pagination, Stack, Text } from "@mantine/core";
import { QueryClient } from "@tanstack/react-query";
import { getTotalCount, useAppPage } from "api/appCollectionApi";
import FallbackComponent from "components/FallbackComponent";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHotkeys } from "react-hotkeys-hook";
import classes from "../MainView/MainView.module.css";
import List from "./List";
import { ListViewHeader } from "./ListViewHeader";

const ListView = (props) => {
	const {
		theme,
		selectApp,
		selectedAppKey,
		setIsPopoverOpen,
		deleteItem,
		addItem,
		updateCurrentListKeys,
		currentPage,
		setCurrentPage,
		numPages,
		setNumPages,
		totalCount,
		setTotalCount,
		gotoPrev,
		gotoNext,
	} = props;
	const [filter, setFilter] = useState("");
	const [filteredApps, setFilteredApps] = useState(null);
	const [page, setPage] = useState();
	const [lastChange, setLastChange] = useState(new Date().getTime());
	const queryClient = new QueryClient();

	const [software, setSoftware] = useState();
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState();

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
		updateCurrentListKeys(apps);
		queryClient.cancelQueries(["appCollection"]);
		queryClient.invalidateQueries(["appCollection"]);
	}, [currentPage, filter, software]);

	useEffect(() => {
		useAppPage(currentPage).then((apps) => {
			console.log("Result: ", apps);
			setSoftware(apps);
			apps && selectApp(apps[0]?.key);
		});
	}, [currentPage, lastChange]);

	const touchLastChange = () => {
		setLastChange(new Date().getTime());
	};

	const deleteApp = (key) => {
		deleteItem(key);
		touchLastChange();
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
						onChange={setCurrentPage}
						value={currentPage}
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
