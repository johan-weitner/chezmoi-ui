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
	const { selectedAppKey, page, getTotalSize, pageCount } = state;
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

	const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";

	// useEffect(() => {
	// 	DEBUG &&
	// 		console.log(`ListView.jsx:
	// 		Page: ${page},
	// 		Total: ${getTotalSize(rootStore.store.getState())},
	// 		Count: ${pageCount}`);

	// 	setCurrentPage(page);
	// }, [rootStore.use.page()]);

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
						pageCount={rootStore.get.pageCount()}
					/>
				)}
				<List
					pageContent={rootStore.get.pageContent()}
					isLoading={rootStore.get.isLoading()}
					selectedAppKey={rootStore.get.selectedAppKey()}
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
