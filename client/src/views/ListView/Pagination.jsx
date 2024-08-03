import { useSelector, useDispatch } from "react-redux";
import { Pagination, Stack, Text } from "@mantine/core";
import { filterModel } from "api/filters";
import { useEffect, useState } from "react";
import { rootStore } from "store/store";
import css from "./ListView.module.css";

const PaginationBar = (props) => {
	const dispatch = useDispatch();
	const { gotoPage } = props;
	const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";
	const [currentPage, setCurrentPage] = useState(1);
	const { page, pageCount, activeFilter, totalCount } = useSelector(
		(state) => state.root,
	);

	useEffect(() => {
		setCurrentPage(page);
		debugProps();
	}, []);

	useEffect(() => {
		setCurrentPage(rootStore.get.page());
		debugProps();
	}, [page]);

	useEffect(() => {
		debugProps();
	}, [pageCount]);

	const debugProps = () => {
		DEBUG &&
			console.log(`Pagination.jsx:
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
			/>
			<Text
				size="xs"
				style={{ textAlign: "left", margin: "10px 0 0 20px" }}
				className={css.paginationInfo}
			>
				{(activeFilter && (
					<span>
						{"Filtered by "}
						<b>{filterModel[activeFilter]?.title?.toLowerCase()}</b>
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
