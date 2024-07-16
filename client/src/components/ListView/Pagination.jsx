import { useState, useEffect } from "react";
import { Stack, Text, Pagination } from "@mantine/core";
import { useClient } from "core/ClientProvider";
import { filterModel } from "api/filters";
import css from "./ListView.module.css";

const PaginationBar = (props) => {
	const { page, totalCount, pageCount, getPage, activeFilter } = useClient();
	const [pageNum, setPageNum] = useState(pageCount || 0);
	useEffect(() => {
		setPageNum(pageCount);
	}, [pageCount]);

	if (!pageCount || pageCount === 0) return;

	return (
		<Stack className={css.paginationContainer} justify="center" align="center">
			<Pagination
				total={pageCount}
				gap={15}
				onChange={getPage}
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
				Page {page} of {pageCount} ⋅ {totalCount} apps in total.
			</Text>
		</Stack>
	);
};

export default PaginationBar;
