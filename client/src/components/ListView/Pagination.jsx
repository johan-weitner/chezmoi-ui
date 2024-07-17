import { useEffect, useState } from "react";
import { Stack, Text, Pagination } from "@mantine/core";
import { useClient } from "core/ClientProvider";
import { useStore } from "store/rootState";
import { filterModel } from "api/filters";
import css from "./ListView.module.css";

const PaginationBar = (props) => {
	const { getPage } = useClient();
	const { page, totalCount, pageCount, activeFilter } = useStore();
	const [currentPage, setCurrentPage] = useState(0);

	useEffect(() => {
		console.log(`Page: ${page}, Total: ${totalCount}, Count: ${pageCount}`);
		setCurrentPage(page);
	}, [page]);

	return (
		<Stack className={css.paginationContainer} justify="center" align="center">
			<Pagination
				total={pageCount}
				value={currentPage}
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
