import { Card, Pagination, Stack, Text, Group } from "@mantine/core";
import { QueryClient } from "@tanstack/react-query";
import {
	getTotalCount,
	useAppPage,
	getNoInstallerApps,
	getNoUrlsApps,
	getNoDescApps,
	getNoNameApps,
} from "api/appCollectionApi";
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
		setSelectedAppKey,
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
		filteredView,
		fetchNoNameApps,
		fetchNoDescApps,
		fetchNoInstallerApps,
		fetchNoUrlsApps,
		restoreFilters,
	} = props;
	const [filter, setFilter] = useState("");
	const [filteredApps, setFilteredApps] = useState(null);
	const [useFilter, setUseFilter] = useState(false);
	const [page, setPage] = useState();
	const [lastChange, setLastChange] = useState(new Date().getTime());
	const queryClient = new QueryClient();

	const [software, setSoftware] = useState();
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState();

	const FILTER = {
		noInstallers: {
			key: "noInstallers",
			api: getNoInstallerApps,
			callback: fetchNoInstallerApps,
			title: "Apps without installers",
		},
		noUrls: {
			key: "noUrls",
			api: getNoUrlsApps,
			callback: fetchNoUrlsApps,
			title: "Apps without URLs",
		},
		noDesc: {
			key: "noDesc",
			api: getNoDescApps,
			callback: fetchNoDescApps,
			title: "Apps without name",
		},
		noName: {
			key: "noName",
			api: getNoNameApps,
			callback: fetchNoNameApps,
			title: "Apps without description",
		},
	};

	const filterLinks = [
		{
			key: "noInstallers",
			title: "Apps without installers",
		},
		{
			key: "noUrls",
			title: "Apps without URLs",
		},
		{
			key: "noName",
			title: "Apps without name",
		},
		{
			key: "noDesc",
			title: "Apps without description",
		},
	];

	useEffect(() => {
		getTotalCount().then((response) => {
			const { count } = response;
			const pages = Math.ceil(count / 20);
			setNumPages(pages);
			setTotalCount(count);
		});
	}, [useFilter]);

	useEffect(() => {
		setFilteredApps(software);
		updateCurrentListKeys(software);
		queryClient.cancelQueries(["appCollection"]);
		queryClient.invalidateQueries(["appCollection"]);
	}, [currentPage, filter, software]);

	useEffect(() => {
		const apps = useAppPage(currentPage).then((apps) => {
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

	const runFilter = (filterKey) => {
		setUseFilter(filterKey);
		const filter = FILTER[filterKey];
		typeof filter.api === "function" &&
			filter.api().then((apps) => {
				setSoftware(apps);
				setTotalCount(apps.length);
				setNumPages(1);
				updateCurrentListKeys(Object.keys(apps));
				setSelectedAppKey(apps[0].key);
			});
		typeof filter.callback === "function" && filter.callback();
	};

	const restoreFullList = () => {
		const apps = useAppPage(currentPage).then((apps) => {
			setSoftware(apps);
			if (apps && inReverse) {
				selectApp(apps[apps.length - 1]?.key);
			} else if (apps) {
				selectApp(apps[0]?.key);
			}
			setUseFilter(null);
			setFilteredApps(null);
			setSoftware(apps);
			restoreFilters();
			setSelectedAppKey(apps[0].key);
		});
	};

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
				<ListViewHeader
					filter={filter}
					filteredApps={filteredApps}
					filterObj={FILTER}
					theme={theme}
					setFilter={setFilter}
					addItem={addItem}
					editItem={editItem}
					deleteItem={deleteItem}
					runFilter={runFilter}
					restoreFilters={restoreFullList}
					useFilter={useFilter}
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
					{filteredApps && (!useFilter || useFilter === "") && (
						<Text
							size="xs"
							style={{ textAlign: "left", margin: "10px 0 0 20px" }}
							className={css.paginationInfo}
						>
							Page {currentPage} of {numPages} ⋅ {totalCount} apps in total.
						</Text>
					)}
					{useFilter && (
						<Text
							size="xs"
							style={{ textAlign: "left", margin: "10px 0 0 20px" }}
							className={css.paginationInfo}
						>
							Filtered by {FILTER[useFilter].title.toLowerCase()} ⋅ {totalCount}{" "}
							apps in total.
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
