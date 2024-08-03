import { filterModel } from "api/filters";
import { useSelector, useDispatch } from "react-redux";
import {
	setActiveFilter,
	setFilteredList
} from "store/store";

export const useFilterManager = () => {
	const dispatch = useDispatch();

	const applyFilter = (filter) => {
		dispatch(setActiveFilter(filter));

		const filteredApps = filterModel[filter].method();
		dispatch(setFilteredList(filteredApps));
	};

	const clearFilter = () => {
		dispatch(setActiveFilter(null));
		dispatch(setFilteredList(null));
	};

	return { applyFilter, clearFilter };
};
