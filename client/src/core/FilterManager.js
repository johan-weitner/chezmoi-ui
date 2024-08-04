import { filterModel } from "api/filters";
import {
	store,
	setActiveFilter,
	setFilteredList
} from "store/store";
import { log } from 'utils/logger';

export const useFilterManager = () => {
	const { dispatch } = store;

	const applyFilter = (filter) => {
		dispatch(setActiveFilter(filter));

		const filteredApps = filterModel[filter].method();
		log.debug("Filtered apps: ", filteredApps);
		dispatch(setFilteredList(filteredApps));
	};

	const clearFilter = () => {
		dispatch(setActiveFilter(null));
		dispatch(setFilteredList(null));
	};

	return { applyFilter, clearFilter };
};
