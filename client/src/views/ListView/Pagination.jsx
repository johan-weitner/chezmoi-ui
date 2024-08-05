import { useSelector } from "react-redux";
import { Pagination, Stack, Text } from "@mantine/core";
import { filterModel } from "api/filters";
import { useEffect, useState } from "react";
import css from "./ListView.module.css";
import { log } from "utils/logger";

const PaginationBar = (props) => {
	const { gotoPage } = props;
	const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";
	const [currentPage, setCurrentPage] = useState(1);
	const { page, pageCount, activeFilter, totalCount, filteredList } =
		useSelector((state) => state.root);

	useEffect(() => {
		setCurrentPage(page);
		debugProps();
	}, []);

	useEffect(() => {
		setCurrentPage(page);
		debugProps();
	}, [page]);

	useEffect(() => {
		debugProps();
	}, [pageCount]);

	const debugProps = () => {
		log.debug(`Pagination.jsx:
			currentPage: ${page},
			Total: ${pageCount},
			currentFilter: ${activeFilter}`);
	};

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
			</Text>
		</Stack>
	);
};

export default PaginationBar;
