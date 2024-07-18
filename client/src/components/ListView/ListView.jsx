import { useEffect } from "react";
import { Card, useMantineTheme } from "@mantine/core";
import { useClientManager } from "core/ClientProvider";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import commonCss from "../MainView/MainView.module.css";
import List from "./List";
import { ListViewHeader } from "./ListViewHeader";
import PaginationBar from "./Pagination";

const ListView = (props) => {
	const theme = useMantineTheme();
	const debugMode = import.meta.env.VITE_DEBUG;

	const {
		useInit,
		bootstrapClient,
		allApps,
		page,
		totalCount,
		pageCount,
		pageContent,
		selectApp,
		applyFilter,
		restoreFilters,
		activeFilter,
		selectedAppKey,
	} = useClientManager();

	useEffect(() => {
		bootstrapClient();
	}, []);

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
				<ListViewHeader />
				<PaginationBar />
				{pageContent && <List />}
			</Card>
			{false && (
				<pre style={{ textAlign: "left" }}>
					Page: {page} | Total: {totalCount} | Pages: {pageCount} |
					selectedAppKey: {selectedAppKey}
				</pre>
			)}
		</ErrorBoundary>
	);
};

ListView.whyDidYouRender = true;
export default ListView;
