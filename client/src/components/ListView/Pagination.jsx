import { Stack, Text } from "@mantine/core";
import { useClient } from "core/ClientProvider";
import { filterModel } from "api/filters";
import css from "./ListView.module.css";

const Pagination = (props) => {
	const { page, totalCount, pageCount, getPage, activeFilter } = useClient();

	return (
		<Stack className={css.paginationContainer} justify="center" align="center">
			<Pagination
				total={56}
				gap={15}
				onChange={console.log}
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

export default Pagination;
