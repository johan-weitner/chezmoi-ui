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
import { rootStore } from "store/store";
import { getAllApps } from "api/appCollectionApi";
import { useEffect, useState } from "react";
import { useClientManager } from "core/ClientManager";

const ListView = (props) => {
	const { store } = rootStore;

	const state = store.getState();
	const { page, pageContent, selectedAppKey } = state;
	const clientManager = useClientManager();

	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageContent, setCurrentPageContent] = useState(null);
	const [date, setDate] = useState(null);

	useEffect(() => {
		console.log("Seeding store...");
		clientManager.seedStore();
	}, []);

	useEffect(() => {
		console.log("New page: ", currentPage);
		rootStore.set.page(currentPage);
		console.log("Set in store: ", rootStore.get.page());
	}, [currentPage, date]);

	useEffect(() => {
		console.log("!!! Updating content");
		selectPageContent(state).then((content) => {
			console.log("List size: ", content.length);
			setCurrentPageContent(content);
		});
	}, [currentPage, date]);

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
						<b>APP COLLECTION </b>
						<button
							type="button"
							onClick={() => {
								setDate(new Date().getTime());
							}}
						>
							Force
						</button>
					</caption>
					<tbody style={{ backgroundColor: "#333", border: "1px solid #777" }}>
						<tr>
							<td>Page: {currentPage}</td>
							<td>inReverse: {rootStore.get.inReverse()}</td>
							<td>pageCount: {rootStore.get.pageCount()}</td>
							<td>currentPage: {typeof currentPage}</td>
							<td>selectedAppKey: {selectedAppKey}</td>
						</tr>
						<tr>
							<td>Prev</td>
							<td>
								<button
									type="button"
									onClick={() => {
										setCurrentPage(currentPage - 1);
									}}
								>
									Prev page
								</button>
							</td>
							<td>
								<button
									type="button"
									onClick={() => {
										setCurrentPage(currentPage + 1);
									}}
								>
									Next page
								</button>
							</td>
							<td>Next</td>
							<td>-</td>
						</tr>
						<tr>
							<td>Prev app</td>
							<td>
								<button
									type="button"
									onClick={() => {
										clientManager.selectPrevApp();
									}}
								>
									Prev
								</button>
							</td>
							<td>
								<button
									type="button"
									onClick={() => {
										clientManager.selectNextApp();
									}}
								>
									Next app
								</button>
							</td>
							<td>Next</td>
							<td>-</td>
						</tr>
					</tbody>
				</table>
				<div style={{ textAlign: "left" }}>
					<h3>Current page</h3>
					<ul style={{ listStyle: "none", margin: "0", padding: "0" }}>
						{Array.isArray(pageContent) &&
							pageContent?.map((item) => {
								return (
									<li key={item.key}>
										<input
											type="checkbox"
											defaultChecked={selectedAppKey === item.key}
										/>{" "}
										{item.name} -{" "}
										<span
											style={{
												fontSize: ".9em",
												fontStyle: "italic",
												color: "#666",
											}}
										>
											({item.key})
										</span>
									</li>
								);
							})}
					</ul>
				</div>
			</Card>
		</ErrorBoundary>
	);
};

// ListView.whyDidYouRender = true;
export default ListView;
