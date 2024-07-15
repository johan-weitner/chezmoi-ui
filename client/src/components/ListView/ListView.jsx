import {
	Card,
	Pagination,
	Stack,
	Text,
	Group,
	useMantineTheme,
} from "@mantine/core";
import { QueryClient } from "@tanstack/react-query";
import {
	getTotalCount,
	useAppPage,
	getNoInstallerApps,
	getNoUrlsApps,
	getNoDescApps,
	getNoNameApps,
} from "api/appCollectionApi";
import { useClientManager } from "core/ClientProvider";
import { filterModel } from "api/filters";
import FallbackComponent from "components/FallbackComponent";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import commonCss from "../MainView/MainView.module.css";
import List from "./List";
import css from "./ListView.module.css";
import { ListViewHeader } from "./ListViewHeader";

const ListView = (props) => {
	// const {
	// 	theme,
	// 	selectApp,
	// 	selectedAppKey,
	// 	setSelectedAppKey,
	// 	setIsPopoverOpen,
	// 	deleteItem,
	// 	addItem,
	// 	editItem,
	// 	updateCurrentListKeys,
	// 	currentPage,
	// 	setCurrentPage,
	// 	numPages,
	// 	setNumPages,
	// 	totalCount,
	// 	setTotalCount,
	// 	gotoPrev,
	// 	gotoNext,
	// 	inReverse,
	// 	filteredView,
	// 	initFilteredView,
	// 	restoreFilters,
	// } = props;
	// const [filter, setFilter] = useState("");
	// const [filteredApps, setFilteredApps] = useState(null);
	// const [useFilter, setUseFilter] = useState(false);
	// const [page, setPage] = useState();
	// const [lastChange, setLastChange] = useState(new Date().getTime());
	// const queryClient = new QueryClient();

	// const [software, setSoftware] = useState();
	// const [error, setError] = useState();
	// const [isLoading, setIsLoading] = useState();

	// const FILTER = {
	// 	noInstallers: {
	// 		key: "noInstallers",
	// 		api: getNoInstallerApps,
	// 		title: "Apps without installers",
	// 	},
	// 	noUrls: {
	// 		key: "noUrls",
	// 		api: getNoUrlsApps,
	// 		title: "Apps without URLs",
	// 	},
	// 	noDesc: {
	// 		key: "noDesc",
	// 		api: getNoDescApps,
	// 		title: "Apps without name",
	// 	},
	// 	noName: {
	// 		key: "noName",
	// 		api: getNoNameApps,
	// 		title: "Apps without description",
	// 	},
	// };

	// useEffect(() => {
	// 	getTotalCount().then((response) => {
	// 		const { count } = response;
	// 		const pages = Math.ceil(count / 20);
	// 		setNumPages(pages);
	// 		setTotalCount(count);
	// 	});
	// }, [useFilter]);

	// useEffect(() => {
	// 	setFilteredApps(software);
	// 	updateCurrentListKeys(software);
	// 	queryClient.cancelQueries(["appCollection"]);
	// 	queryClient.invalidateQueries(["appCollection"]);
	// }, [currentPage, filter, software]);

	// useEffect(() => {
	// 	const apps = useAppPage(currentPage).then((apps) => {
	// 		setSoftware(apps);
	// 		if (apps && inReverse) {
	// 			selectApp(apps[apps.length - 1]?.key);
	// 		} else if (apps) {
	// 			selectApp(apps[0]?.key);
	// 		}
	// 	});
	// }, [currentPage, lastChange]);

	// const touchLastChange = () => {
	// 	setLastChange(new Date().getTime());
	// };

	// const deleteApp = (key) => {
	// 	deleteItem(key);
	// 	touchLastChange();
	// 	setFilteredApps(filteredApps.filter((item) => item.key !== key));
	// };

	// const runFilter = (filterKey) => {
	// 	setUseFilter(filterKey);
	// 	const filter = FILTER[filterKey];
	// 	typeof filter.api === "function" &&
	// 		filter.api().then((apps) => {
	// 			setSoftware(apps);
	// 			setTotalCount(apps.length);
	// 			setNumPages(1);
	// 			updateCurrentListKeys(Object.keys(apps));
	// 			setSelectedAppKey(apps[0].key);
	// 		});
	// 	initFilteredView();
	// };

	// const restoreFullList = () => {
	// 	const apps = useAppPage(currentPage).then((apps) => {
	// 		setSoftware(apps);
	// 		if (apps && inReverse) {
	// 			selectApp(apps[apps.length - 1]?.key);
	// 		} else if (apps) {
	// 			selectApp(apps[0]?.key);
	// 		}
	// 		setUseFilter(null);
	// 		setFilteredApps(null);
	// 		setSoftware(apps);
	// 		restoreFilters();
	// 		setSelectedAppKey(apps[0].key);
	// 	});
	// };
	const {
		allApps,
		totalApps,
		populateList,
		initPagination,
		deleteItem,
		updateItem,
		addItem,
		selectApp,
		selectedApp,
		selectedAppKey,
		page,
		limit,
		totalCount,
		pageCount,
		setPage,
		setLimit,
		gotoPrev,
		gotoNext,
		gotoPrevPage,
		gotoNextPage,
		applyFilter,
		restoreFilters,
		activeFilter,
	} = useClientManager();

	const theme = useMantineTheme();

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
				<ListViewHeader theme={theme} />
				<Stack
					className={css.paginationContainer}
					justify="center"
					align="center"
				>
					<Pagination
						total={pageCount}
						gap={15}
						onChange={setPage}
						value={page}
						className={css.pagination}
						size={"sm"}
						withEdges={true}
					/>
					{allApps && (
						<Text
							size="xs"
							style={{ textAlign: "left", margin: "10px 0 0 20px" }}
							className={css.paginationInfo}
						>
							Page {page} of {pageCount} ⋅ {totalCount} apps in total.
						</Text>
					)}
					{activeFilter && (
						<Text
							size="xs"
							style={{ textAlign: "left", margin: "10px 0 0 20px" }}
							className={css.paginationInfo}
						>
							Filtered by {filterModel[activeFilter].title.toLowerCase()} ⋅{" "}
							{totalCount} apps in total.
						</Text>
					)}
				</Stack>
				{allApps && <List />}
			</Card>
		</ErrorBoundary>
	);
};

export default ListView;
