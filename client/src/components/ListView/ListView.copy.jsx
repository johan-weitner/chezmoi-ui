import { Card, Pagination, Stack, Text } from "@mantine/core";
import { QueryClient } from "@tanstack/react-query";
import { getTotalCount, useAppPage } from "api/appCollectionApi";
import FallbackComponent from "components/FallbackComponent";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHotkeys } from "react-hotkeys-hook";
import commonCss from "../MainView/MainView.module.css";
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
	} = props;

	const [filter, setFilter] = useState("");
	const [filteredApps, setFilteredApps] = useState(null);
	const [page, setPage] = useState();
	const [software, setSoftware] = useState();
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState();
	const [lastChange, setLastChange] = useState(new Date().getTime());
	const queryClient = new QueryClient();
	const [numPages, setNumPages] = useState(1);
	const [totalCount, setTotalCount] = useState(1);

	useAppPage(currentPage).then((data) => {
		const { data: apps, error, isLoading } = data;
		setSoftware(apps);
		setError(error);
		setIsLoading(isLoading);
		apps && selectApp(apps[0]?.key);
	});

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
	}, [page, lastChange, filter, software]);

	const touchLastChange = () => {
		setLastChange(new Date().getTime());
	};

	const deleteApp = (key) => {
		deleteItem(key);
		touchLastChange();
		setFilteredApps(filteredApps.filter((item) => item.key !== key));
	};

	const nextPage = () => {
		if (currentPage < numPages) {
			setCurrentPage(currentPage + 1);
		} else if (page < numPages) {
			setPage(page + 1);
		}
	};

	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		} else if (page > 1) {
			setPage(page - 1);
		}
	};

	useHotkeys("shift + alt + left", () => prevPage());
	useHotkeys("shift + alt + right", () => nextPage());

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
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