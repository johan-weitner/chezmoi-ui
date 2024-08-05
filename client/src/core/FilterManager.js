import { filterModel } from "api/filters";
import {
	store,
	setActiveFilter,
	setFilteredList
} from "store/store";
import { fetchFilteredApps } from "api/appCollectionApi";
import { log } from 'utils/logger';
import { toast } from "sonner";

export const useFilterManager = () => {
	const { dispatch } = store;

	const applyFilter = async (filter) => {
		const apps = await fetchFilteredApps(filter)
			.then((data) => {
				dispatch(setActiveFilter(filter));
				dispatch(setFilteredList(data));
				return data;
			}).catch((e) => {
				log.error(e.message);
				toast.error(e.message);
			});
		return apps;
	};

	const clearFilter = () => {
		dispatch(setActiveFilter(null));
		dispatch(setFilteredList(null));
	};

	return { applyFilter, clearFilter };
};
