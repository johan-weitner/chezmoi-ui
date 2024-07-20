import { useEffect, useState } from "react";
import { Stack, Text, Pagination } from "@mantine/core";
import { rootStore } from "store/store";
import { filterModel } from "api/filters";
import css from "./ListView.module.css";

const PaginationBar = (props) => {
	const { currentPage, totalCount, currentFilter, gotoPage, pageCount } = props;
	const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";

	useEffect(() => {
		DEBUG &&
			console.log(`Pagination.jsx:
			currentPage: ${currentPage},
			Total: ${totalCount},
			Count: ${pageCount});
			currentFilter: ${currentFilter}`);
	}, []);

	return (
		<Stack className={css.paginationContainer} justify="center" align="center">
			<Pagination
				total={rootStore.get.pageCount()}
				value={rootStore.get.page()}
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
				{currentFilter && (
					<span>
						{"Filtered by "}
						<b>
							{filterModel[rootStore.use.activeFilter()].title.toLowerCase()}
						</b>
						{" ⋅ "}
					</span>
				)}
				Page {rootStore.get.page()} of {rootStore.get.pageCount()} ⋅{" "}
				{rootStore.get.pageCount()} apps in total.
			</Text>
		</Stack>
	);
};

export default PaginationBar;
