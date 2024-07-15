import { useState, useContext, useEffect } from "react";
import "./App.css";
import {
	useDataManager,
	useClient,
	useDataContext,
} from "core/ClientProvider.jsx";

const App2 = () => {
	const {
		allApps,
		totalApps,
		fetchAllApps,
		deleteItem,
		updateItem,
		addItem,
		selectApp,
		selectedApp,
		page,
		limit,
		totalCount,
		pageCount,
		setLimit,
		gotoPrev,
		gotoNext,
		gotoPrevPage,
		gotoNextPage,
		initFilteredView,
		restoreFilters,
		activeFilter,
	} = useDataManager();

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
								<button
									type="button"
									onClick={() => initFilteredView("noName")}
								>
									Filter
								</button>
							</td>
							<td>
								<button type="button" onClick={() => restoreFilters()}>
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
						{allApps?.map((app) => {
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
