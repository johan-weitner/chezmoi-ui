import { useSelector } from "react-redux";
import { Pagination, Stack, Text } from "@mantine/core";
import { filterModel } from "api/filterApi";
import { useEffect, useState } from "react";
import css from "./ListView.module.css";
import { log } from "utils/logger";
import { ICON } from "constants/icons";

const PaginationBar = (props) => {
	const { gotoPage } = props;
	const [currentPage, setCurrentPage] = useState(1);
	const { page, pageCount, activeFilter, totalCount, filteredList } =
		useSelector((state) => state.root);
	const hideCompleted = useSelector((state) => state.root.hideCompleted);

	return (
		<Stack className={css.paginationContainer} justify="center" align="center">
			<Pagination
				total={pageCount}
				value={page}
				gap={15}
				onChange={gotoPage}
				className={css.pagination}
				size={"sm"}
				withEdges={true}
				boundaries={0}
				withControls={false}
				disabled={activeFilter}
			/>
			<Text
				size="xs"
				style={{ textAlign: "left", margin: "10px 0 0 20px" }}
				className={css.paginationInfo}
			>
				{(activeFilter && (
					<span>
						{"Filtered by "}
						<b>{filterModel[activeFilter]?.title?.toLowerCase()}</b> ⋅{" "}
						{filteredList?.length} apps in total.
					</span>
				)) || (
					<span>
						Page {page} of {pageCount} ⋅ {totalCount} apps in total.
					</span>
				)}
				{hideCompleted && (
					<span style={{ fontStyle: "italic", color: "#999" }}>
						{" "}
						(Hiding finished items)
					</span>
				)}
			</Text>
		</Stack>
	);
};

export default PaginationBar;
