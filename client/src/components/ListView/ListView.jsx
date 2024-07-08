import { Card, Pagination, Stack, Text } from "@mantine/core";
import {
	useAppCollection,
	useAppPage,
	useTotalCount,
} from "api/appCollectionApi";
import FallbackComponent from "components/FallbackComponent";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import BarSpinner from "../BarSpinner";
import classes from "../MainView/MainView.module.css";
import { ListItem } from "./ListItem";
import { ListViewHeader } from "./ListViewHeader";

const ListView = (props) => {
	const { theme, selectApp, selectedAppKey } = props;
	const [filter, setFilter] = useState("");
	const [page, setPage] = useState();
	const [numPages, setNumPages] = useState(50);
	const { data: software, error, isLoading } = useAppPage(page);

	useEffect(() => {
		// console.log('SelectedAppKey changed: ', selectedAppKey);
	}, []);

	// useTotalCount().then(response => {
	// 	const { data: { length: count } } = response;
	// 	const pages = Math.ceil(count / 20);
	// 	console.log('Total number of pages: ', pages);
	// 	setNumPages(50);
	// });
	const pageSize = 20;

	const filteredApps = software?.filter((item) => {
		return item?._name?.toLowerCase().includes(filter?.toLowerCase());
	});

	const loading = isLoading ? <BarSpinner /> : null;
	const errorMsg = error ? <div>ERROR: {error.message || error}</div> : null;

	return (
		software && (
			<ErrorBoundary
				fallbackRender={(error) => <FallbackComponent error={error.message} />}
			>
				{loading}
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
								{filteredApps?.length} apps in total.
							</Text>
						)}
					</Stack>

					<Card
						shadow="md"
						fz="sm"
						c="dimmed"
						mt="sm"
						className={classes.scrollContainer}
						style={{
							textAlign: "left",
							overflow: "scroll",
							height: "calc(100vh - 150px)",
						}}
					>
						{errorMsg}
						{filteredApps?.length > 0 &&
							filteredApps.map((item) => {
								return (
									<ListItem
										selectApp={selectApp}
										selectedAppKey={selectedAppKey}
										app={item}
										key={nanoid()}
									/>
								);
							})}
					</Card>
				</Card>
			</ErrorBoundary>
		)
	);
};

export default ListView;
