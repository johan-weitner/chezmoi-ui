import { Pagination, Stack, Text } from "@mantine/core";
import { filterModel } from "api/filters";
import { useEffect, useState } from "react";
import { rootStore } from "store/store";
import css from "./ListView.module.css";

const PaginationBar = (props) => {
	const { totalCount, currentFilter, gotoPage, pageCount } = props;
	const DEBUG = import.meta.env.VITE_DEBUG_MODE === "true";
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setCurrentPage(rootStore.get.page());
		debugProps();
	}, []);

	useEffect(() => {
		setCurrentPage(rootStore.get.page());
		debugProps();
	}, [rootStore.get.page()]);

	const debugProps = () => {
		DEBUG &&
			console.log(`Pagination.jsx:
			currentPage: ${rootStore.get.page()},
			Total: ${rootStore.get.pageCount()},
			Count: ${pageCount});
			currentFilter: ${currentFilter}`);
	};

	return (
		<Stack className={css.paginationContainer} justify="center" align="center">
			<Pagination
				total={totalCount}
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
