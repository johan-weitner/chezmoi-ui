import { useDataManager } from "./DataManager";
import { useFilterManager } from "./FilterManager";
import { useGroupManager } from "./GroupManager";
import { usePageManager } from "./PageManager";
import { useSelectionManager } from "./SelectionManager";

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
		...groupManager,
	};
};
