import { rootStore } from "store/store";
import { useDataManager } from "./DataManager";
import { usePageManager } from "./PageManager";
import { useSelectionManager } from "./SelectionManager";
import { useFilterManager } from "./FilterManager";

export const useClientManager = () => {
	const { store } = rootStore;
	const dataManager = useDataManager();
	const pageManager = usePageManager();
	const selectionManager = useSelectionManager();
	const filtermanager = useFilterManager();
	const { gotoPage } = pageManager;

	return {
		store,
		openPage: gotoPage,
		...dataManager,
		...pageManager,
		...selectionManager,
		...filtermanager,
	};
};
