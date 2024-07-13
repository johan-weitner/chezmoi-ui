import { Card, Pagination, Stack, Text } from "@mantine/core";
import { QueryClient } from "@tanstack/react-query";
import { getTotalCount, useAppPage } from "api/appCollectionApi";
import FallbackComponent from "components/FallbackComponent";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import commonCss from "../MainView/MainView.module.css";
import List from "./List";
import css from "./ListView.module.css";
import { ListViewHeader } from "./ListViewHeader";

const ListView = (props) => {
	const {
		theme,
		selectApp,
		selectedAppKey,
		setIsPopoverOpen,
		deleteItem,
		addItem,
		editItem,
		updateCurrentListKeys,
		currentPage,
		setCurrentPage,
		numPages,
		setNumPages,
		totalCount,
		setTotalCount,
		gotoPrev,
		gotoNext,
		inReverse,
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
		setFilteredApps(software);
		updateCurrentListKeys(software);
		queryClient.cancelQueries(["appCollection"]);
		queryClient.invalidateQueries(["appCollection"]);
	}, [currentPage, filter, software]);

	useEffect(() => {
		const apps = useAppPage(currentPage).then((apps) => {
			console.log('"LISTVIEW: apps: ', apps);
			setSoftware(apps);
			if (apps && inReverse) {
				selectApp(apps[apps.length - 1]?.key);
			} else if (apps) {
				selectApp(apps[0]?.key);
			}
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
			<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
				<ListViewHeader
					filter={filter}
					filteredApps={filteredApps}
					theme={theme}
					setFilter={setFilter}
					addItem={addItem}
					editItem={editItem}
					deleteItem={deleteItem}
				/>
				<Stack
					className={css.paginationContainer}
					justify="center"
					align="center"
				>
					<Pagination
						total={numPages}
						gap={15}
						onChange={setCurrentPage}
						value={currentPage}
						className={css.pagination}
						size={"sm"}
						withEdges={true}
					/>
					{filteredApps && (
						<Text
							size="xs"
							style={{ textAlign: "left", margin: "10px 0 0 20px" }}
							className={css.paginationInfo}
						>
							Page {currentPage} of {numPages} ⋅ {totalCount} apps in total.
						</Text>
					)}
				</Stack>
				{software && (
					<List
						software={software}
						selectApp={selectApp}
						selectedAppKey={selectedAppKey}
						error={error}
						loading={isLoading}
						editItem={editItem}
						deleteItem={deleteApp}
					/>
				)}
			</Card>
		</ErrorBoundary>
	);
};

export default ListView;
