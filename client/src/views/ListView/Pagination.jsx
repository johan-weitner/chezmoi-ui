import { useEffect, useState } from "react";
import { Stack, Text, Pagination } from "@mantine/core";
import { rootStore } from "store/store";
import { filterModel } from "api/filters";
import css from "./ListView.module.css";

const PaginationBar = (props) => {
	const { currentPage, totalCount, currentFilter, gotoPage, pageCount } = props;

	useEffect(() => {
		console.log(`Pagination.jsx:
			currentPage: ${currentPage},
			Total: ${totalCount},
			Count: ${pageCount});
			currentFilter: ${currentFilter}`);
	}, []);

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
				{currentFilter && (
					<span>
						{"Filtered by "}
						<b>{filterModel[currentFilter].title.toLowerCase()}</b>
						{" ⋅ "}
					</span>
				)}
				Page {currentPage} of {pageCount} ⋅ {totalCount} apps in total.
			</Text>
		</Stack>
	);
};

export default PaginationBar;
