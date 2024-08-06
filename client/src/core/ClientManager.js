import { useDataManager } from "./DataManager";
import { useFilterManager } from "./FilterManager";
import { usePageManager } from "./PageManager";
import { useSelectionManager } from "./SelectionManager";
import { useGroupManager } from "./GroupManager";

export const useClientManager = () => {
	const dataManager = useDataManager();
	const pageManager = usePageManager();
	const selectionManager = useSelectionManager();
	const filtermanager = useFilterManager();
	const groupManager = useGroupManager();
	const { gotoPage } = pageManager;

	return {
		openPage: gotoPage,
		...dataManager,
		...pageManager,
		...selectionManager,
		...filtermanager,
		...groupManager
	};
};
