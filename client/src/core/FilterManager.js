import { fetchFilteredApps } from "api/fetchApi";
import { filterModel } from "api/filterApi";
import { toast } from "sonner";
import { setActiveFilter, setFilteredList, store } from "store/store";
import { log } from "utils/logger";

export const useFilterManager = () => {
	const { dispatch } = store;

	const applyFilter = async (filter) => {
		const apps = await fetchFilteredApps(filter)
			.then((data) => {
				dispatch(setActiveFilter(filter));
				dispatch(setFilteredList(data));
				return data;
			})
			.catch((e) => {
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
