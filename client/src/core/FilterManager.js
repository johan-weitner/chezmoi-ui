import { filterModel } from "api/filters";
import {
	store,
	setActiveFilter,
	setFilteredList
} from "store/store";

export const useFilterManager = () => {
	const { dispatch } = store;

	const applyFilter = (filter) => {
		dispatch(setActiveFilter(filter));

		const filteredApps = filterModel[filter].method();
		console.log("Filtered apps: ", filteredApps);
		dispatch(setFilteredList(filteredApps));
	};

	const clearFilter = () => {
		dispatch(setActiveFilter(null));
		dispatch(setFilteredList(null));
	};

	return { applyFilter, clearFilter };
};
