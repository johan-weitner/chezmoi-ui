import { Card, Pagination, Stack, Text, useMantineTheme } from "@mantine/core";
import { useClient } from "core/ClientProvider";
import { filterModel } from "api/filters";
import FallbackComponent from "components/FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";
import commonCss from "../MainView/MainView.module.css";
import List from "./List";
import css from "./ListView.module.css";
import { ListViewHeader } from "./ListViewHeader";

const ListView = (props) => {
	const { allApps, page, totalCount, pageCount, getPage, activeFilter } =
		useClient();

	const theme = useMantineTheme();

	return (
		<ErrorBoundary
			fallbackRender={(error) => <FallbackComponent error={error.message} />}
		>
			<Card shadow="md" radius="md" className={commonCss.card} padding="xl">
				<ListViewHeader theme={theme} />
				<Stack
					className={css.paginationContainer}
					justify="center"
					align="center"
				>
					<Pagination
						total={pageCount}
						gap={15}
						onChange={getPage}
						value={page}
						className={css.pagination}
						size={"sm"}
						withEdges={true}
					/>
					{allApps && (
						<Text
							size="xs"
							style={{ textAlign: "left", margin: "10px 0 0 20px" }}
							className={css.paginationInfo}
						>
							Page {page} of {pageCount} ⋅ {totalCount} apps in total.
						</Text>
					)}
					{activeFilter && (
						<Text
							size="xs"
							style={{ textAlign: "left", margin: "10px 0 0 20px" }}
							className={css.paginationInfo}
						>
							Filtered by {filterModel[activeFilter].title.toLowerCase()} ⋅{" "}
							{totalCount} apps in total.
						</Text>
					)}
				</Stack>
				{allApps && <List />}
			</Card>
		</ErrorBoundary>
	);
};

export default ListView;
