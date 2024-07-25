import { rootStore } from "store/store";
import { useDataManager } from "./DataManager";
import { useListManager } from "./ListManager";
import { useSelectionManager } from "./SelectionManager";
import { useFilterManager } from "./FilterManager";

export const useClientManager = () => {
	const { store } = rootStore;
	const dataManager = useDataManager();
	const listManager = useListManager();
	const selectionManager = useSelectionManager();
	const filtermanager = useFilterManager();
	const { gotoPage } = listManager;

	return {
		store,
		openPage: gotoPage,
		...dataManager,
		...listManager,
		...selectionManager,
		...filtermanager,
	};
};
