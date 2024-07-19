import { Card } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import commonCss from "views/MainView/MainView.module.css";
import List from "./List";
import { ListViewHeader } from "./ListViewHeader";
import PaginationBar from "./Pagination";
import {
	getAppCollection,
	getPage,
	getPageCount,
	getPageContent,
	getPageSize,
	getInReverse,
	getFilterModel,
	getActiveFilter,
	getFilteredList,
	getSelectedApp,
	getSelectedAppKey,
	getEditMode,
	getCurrentIndex,
	getPreviousKey,
	getNextKey,
	selectPageContent,
} from "store/selectors";
import {
	useAppCollectionStore,
	usePageStore,
	useSelectionStore,
} from "store/store";
import { getAllApps } from "api/appCollectionApi";
import { useEffect, useState } from "react";
import { useClientManager } from "core/ClientManager";

const ListView = (props) => {
	const appCollectionStore = useAppCollectionStore();
	const { appCollection, setAppCollection, saveUpdatedApp, saveNewApp } =
		useAppCollectionStore();
	const pageStore = usePageStore();
	const {
		setPage,
		setPageCount,
		setPageContent,
		setPageSize,
		setInReverse,
		setActiveFilter,
		setFilteredList,
		inReverse,
		page,
		pageContent,
		pageCount,
	} = usePageStore();
	const selectionStore = useSelectionStore();
	const { setSelectedApp, setSelectedAppKey, setEditMode } = selectionStore;

	const [currentPage, setCurrentPage] = useState(null);

	useEffect(() => {
		getAllApps().then((apps) => {
			setAppCollection(apps);
			setPageCount(Math.ceil(apps.length / getPageSize(pageStore)));
			setPage(1);
		});
	}, []);

	useEffect(() => {
		console.log("New page: ", page);
		const apps = selectPageContent(1);
		setPageContent(apps);
		setCurrentPage;
		apps;
	}, [page]);

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
				<ListViewHeader />
				{/* <PaginationBar /> */}
				{/* <List /> */}
				<table style={{ backgroundColor: "#222", border: "1px solid #777" }}>
					<caption style={{ backgroundColor: "#222", padding: "10px 0" }}>
						<b>APP COLLECTION</b>
					</caption>
					<tbody style={{ backgroundColor: "#333", border: "1px solid #777" }}>
						<tr>
							<td>Page: {page}</td>
							<td>inReverse: {inReverse}</td>
							<td>pageCount: {pageCount}</td>
							<td>currentPage: {typeof currentPage}</td>
						</tr>
					</tbody>
				</table>
				<div style={{ textAlign: "left" }}>
					<h3>Current page</h3>
					{appCollection && (
						<pre>
							{JSON.stringify(currentPage, null, 2).substring(0, 2000)} ...
						</pre>
					)}
				</div>
			</Card>
		</ErrorBoundary>
	);
};

// ListView.whyDidYouRender = true;
export default ListView;
