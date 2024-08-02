import { rootStore } from "store/store";
import { useDataManager } from "./DataManager";
import { useFilterManager } from "./FilterManager";
import { usePageManager } from "./PageManager";
import { useSelectionManager } from "./SelectionManager";
import { useGroupManager } from "./GroupManager";

export const useClientManager = () => {
	const { store } = rootStore;
	const dataManager = useDataManager();
	const pageManager = usePageManager();
	const selectionManager = useSelectionManager();
	const filtermanager = useFilterManager();
	const groupManager = useGroupManager();
	const { gotoPage } = pageManager;

	return {
		store,
		openPage: gotoPage,
		...dataManager,
		...pageManager,
		...selectionManager,
		...filtermanager,
		...groupManager
	};
};
