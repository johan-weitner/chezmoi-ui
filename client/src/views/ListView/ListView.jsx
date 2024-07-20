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
	const {
		setSelectedAppKey,
		deleteItem,
		editItem,
		addItem,
		selectPrevApp,
		selectNextApp,
		gotoPage,
		gotoPrevPage,
		gotoNextPage,
	} = useClientManager();

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
				<p>selectedAppKey: {rootStore.get.selectedAppKey}</p>
				{rootStore.get.pageCount() > 1 && (
					<PaginationBar
						currentPage={rootStore.get.page()}
						totalCount={rootStore.get.appCollection()?.length}
						currentFilter={rootStore.get.activeFilter()}
						gotoPage={gotoPage}
						pageCount={rootStore.get.pageCount()}
					/>
				)}
				<List
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
