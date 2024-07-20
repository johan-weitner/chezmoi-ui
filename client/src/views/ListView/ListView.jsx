import { useState, useEffect } from "react";
import { Card } from "@mantine/core";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import commonCss from "views/MainView/MainView.module.css";
import List from "./List";
import { ListViewHeader } from "./ListViewHeader";
import PaginationBar from "./Pagination";
import { rootStore } from "store/store";
import { useClientManager } from "core/ClientManager";
import { useHotkeys } from "react-hotkeys-hook";

const ListView = (props) => {
	const state = rootStore.store.getState();
	const {
		pageContent,
		selectedAppKey,
		page,
		getTotalSize,
		pageCount,
		activeFilter,
	} = state;
	const {
		seedStore,
		getPageContent,
		setSelectedAppKey,
		deleteItem,
		editItem,
		addItem,
		selectPrevApp,
		selectNextApp,
		gotoPage,
	} = useClientManager();

	const [currentPageContent, setCurrentPageContent] = useState(null);
	const [isWorking, setIsWorking] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [currentFilter, setCurrentFilter] = useState(null);

	useEffect(() => {
		console.log("Seeding client...");
		seedStore().then((apps) => {
			const list = getPageContent();
			setCurrentPageContent(list);

			console.log(`ListView.jsx:
			Page: ${page},
			Total: ${getTotalSize(rootStore.store.getState())},
			Count: ${pageCount}`);
			setCurrentPage(page);
			setTotalCount(getTotalSize(rootStore.store.getState()));
		});
	}, []);

	useEffect(() => {
		const status = rootStore.get.isLoading();
		setIsWorking(status);
	}, [rootStore.use.isLoading()]);

	useEffect(() => {
		console.log(`ListView.jsx:
			Page: ${page},
			Total: ${getTotalSize(rootStore.store.getState())},
			Count: ${pageCount}`);
		setCurrentPage(page);
	}, [rootStore.use.page()]);

	useHotkeys("alt + b", () => selectPrevApp());
	useHotkeys("alt + n", () => selectNextApp());
	useHotkeys("alt + left", () => selectPrevApp());
	useHotkeys("alt + right", () => selectNextApp());
	useHotkeys("alt + n", () => addItem());
	useHotkeys("alt + e", () => editItem());
	useHotkeys("shift + alt + left", () => gotoPrevPage());
	useHotkeys("shift + alt + right", () => gotoNextPage());
	useHotkeys("alt + w", () => clearAppSelection());

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
				<ListViewHeader />
				{pageCount > 1 && (
					<PaginationBar
						currentPage={rootStore.get.page()}
						totalCount={rootStore.get.appCollection()?.length}
						currentFilter={rootStore.get.activeFilter()}
						gotoPage={gotoPage}
						pageCount={pageCount}
					/>
				)}
				<List
					pageContent={rootStore.get.pageContent()}
					isLoading={isWorking}
					selectedAppKey={selectedAppKey}
					setSelectedAppKey={setSelectedAppKey}
					deleteItem={deleteItem}
					editItem={editItem}
				/>
			</Card>
		</ErrorBoundary>
	);
};

// ListView.whyDidYouRender = true;
export default ListView;

/*
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
							<td>currentApp: {currentApp}</td>
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
											defaultChecked={currentApp === item.key}
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
*/
