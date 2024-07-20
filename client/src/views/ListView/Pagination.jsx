import { useEffect, useState } from "react";
import { Stack, Text, Pagination } from "@mantine/core";
import { rootStore } from "store/store";
import { filterModel } from "api/filters";
import css from "./ListView.module.css";
import { useClientManager } from "core/ClientManager";

const PaginationBar = (props) => {
	const { page, getTotalSize, pageCount, activeFilter } =
		rootStore.store.getState();
	const { getPageContent } = useClientManager();
	const [currentPage, setCurrentPage] = useState(0);

	useEffect(() => {
		console.log(`Page: ${page},
			Total: ${getTotalSize(rootStore.store.getState())},
			Count: ${pageCount}`);
		setCurrentPage(page);
	}, [page]);

	const gotoPage = (page) => {
		console.log(`Goto page: ${page}`);
		setCurrentPage(page);
		rootStore.set.page(page);
	};

	return (
		<Stack className={css.paginationContainer} justify="center" align="center">
			<Pagination
				total={pageCount}
				value={currentPage}
				gap={15}
				onChange={gotoPage}
				className={css.pagination}
				size={"sm"}
				withEdges={true}
			/>
			<Text
				size="xs"
				style={{ textAlign: "left", margin: "10px 0 0 20px" }}
				className={css.paginationInfo}
			>
				{activeFilter && (
					<span>
						{"Filtered by "}
						<b>{filterModel[activeFilter].title.toLowerCase()}</b>
						{" ⋅ "}
					</span>
				)}
				Page {page} of {pageCount} ⋅ {getTotalSize(rootStore.store.getState())}{" "}
				apps in total.
			</Text>
		</Stack>
	);
};

export default PaginationBar;
