import { useState, useContext, useEffect } from "react";
import "./App.css";
// import { useClient, ClientProvider } from "core/ClientProvider.jsx";
import {
	usePageManager,
	useDataManager,
	useClient,
	usePageContext,
	useDataContext,
} from "core/ClientProvider.jsx";
import { getAllApps } from "./api/appCollectionApi";

const App2 = () => {
	const [collection, setCollection] = useState([]);

	const {
		allApps,
		totalApps,
		setAllApps,
		fetchAllApps,
		deleteItem,
		updateItem,
		addItem,
		selectApp,
		selectedApp,
	} = useDataManager();

	// fetchAllApps().then((apps) => {
	// 	console.log("Fetched apps");
	// 	// setCollection(apps);
	// });
	const {
		page,
		limit,
		totalCount,
		pageCount,
		setPage,
		setListSize,
		setNumPages,
		setLimit,
		lastChange,
		gotoPrev,
		gotoNext,
		gotoPrevPage,
		gotoNextPage,
		initFilteredView,
		restoreFilters,
		activeFilter,
	} = usePageManager(1, 20, allApps?.length || 0);

	// const subset = allApps?.slice(0, 30);
	const setFilter = (filter) => {
		initFilteredView(filter).then((apps) => {
			setCollection(apps);
		});
	};

	const resetFilter = () => {
		restoreFilters().then((apps) => {
			setCollection(apps);
		});
	};

	useEffect(() => {
		fetchAllApps().then((apps) => {
			console.log("Fetched apps");
			setCollection(apps);
			setListSize(apps.length);
			setNumPages(apps.length);
		});
	}, []);

	useEffect(() => {
		setListSize(collection.length);
		setNumPages(collection.length);
	}, [collection]);

	return (
		<>
			<div>
				<h1>TESTING</h1>
				<table className="debugTable">
					<tbody>
						<tr>
							<td>Selection: {selectedApp?.name}</td>
							<td>
								Page: {page} of {pageCount}
							</td>
							<td>Total count: {totalCount}</td>
							<td>Active filter: {activeFilter}</td>
							<td>-</td>
						</tr>
					</tbody>
				</table>
				<table className="debugTable">
					<tbody>
						<tr>
							<td>
								<button type="button" onClick={() => setFilter("noName")}>
									Filter
								</button>
							</td>
							<td>
								<button type="button" onClick={() => resetFilter()}>
									Reset
								</button>
							</td>
							<td>-</td>
							<td>-</td>
							<td>-</td>
						</tr>
					</tbody>
				</table>
				<table style={{ textAlign: "left" }}>
					<thead>
						<tr>
							<th>Key</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						{collection?.map((app) => {
							return (
								<tr key={app.key}>
									<td>{app.key}</td>
									<td>
										<button type="button" onClick={() => selectApp(app.key)}>
											{app.name}
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default App2;
