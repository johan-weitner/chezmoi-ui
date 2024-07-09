import { Card, Pagination, Stack, Text } from "@mantine/core";
import { getTotalCount, useAppPage } from "api/appCollectionApi";
import FallbackComponent from "components/FallbackComponent";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import classes from "../MainView/MainView.module.css";
import List from "./List";
import { ListViewHeader } from "./ListViewHeader";

const ListView = (props) => {
	const { theme, selectApp, selectedAppKey } = props;
	const [filter, setFilter] = useState("");
	const [page, setPage] = useState();
	const [numPages, setNumPages] = useState(1);
	const [totalCount, setTotalCount] = useState(1);
	const { data: software, error, isLoading } = useAppPage(page);

	useEffect(() => {
		getTotalCount().then((response) => {
			const { count } = response;
			const pages = Math.ceil(count / 20);
			console.log("Total number of pages: ", pages);
			setNumPages(pages);
			setTotalCount(count);
		});
	}, []);

	const filteredApps = software?.filter((item) => {
		return item?._name?.toLowerCase().includes(filter?.toLowerCase());
	});

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={classes.card} padding="xl">
				<ListViewHeader
					filter={filter}
					filteredApps={filteredApps}
					theme={theme}
					setFilter={setFilter}
				/>
				<Stack justify="center" align="center" style={{ marginTop: "20px" }}>
					<Pagination
						total={numPages}
						gap={20}
						onChange={setPage}
						value={page}
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
				/>
			</Card>
		</ErrorBoundary>
	);
};

export default ListView;
