import { Pagination, Stack, Text } from "@mantine/core";
import { filterModel } from "api/filters";
import { useEffect, useState } from "react";
import { rootStore } from "store/store";
import css from "./ListView.module.css";

const PaginationBar = (props) => {
	const { gotoPage } = props;
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

	useEffect(() => {
		debugProps();
	}, [rootStore.get.pageCount()]);

	const debugProps = () => {
		DEBUG &&
			console.log(`Pagination.jsx:
			currentPage: ${rootStore.get.page()},
			Total: ${rootStore.get.pageCount()},
			currentFilter: ${currentFilter}`);
	}; // boundaries siblings

	return (
		<Stack className={css.paginationContainer} justify="center" align="center">
			<Pagination
				total={rootStore.use.pageCount()}
				value={rootStore.use.page()}
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
				{(rootStore.use.activeFilter() && (
					<span>
						{"Filtered by "}
						<b>
							{filterModel[rootStore.get.activeFilter()]?.title?.toLowerCase()}
						</b>
					</span>
				)) || (
					<span>
						Page {rootStore.get.page()} of {rootStore.get.pageCount()} ⋅{" "}
						{rootStore.get.totalCount()} apps in total.
					</span>
				)}
			</Text>
		</Stack>
	);
};

export default PaginationBar;
