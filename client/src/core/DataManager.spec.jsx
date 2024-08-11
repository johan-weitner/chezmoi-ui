import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDataManager } from "./DataManager";
import {
	deleteApp,
	getAllApps,
	getAllTags,
	updateTagWhiteList,
	fetchAppGroups,
} from "api/fetchApi";
import { selectPageContent } from "store/selectors";
import {
	getState,
	store,
	setAppCollection,
	setPageContent,
	setTotalCount,
	setPageCount,
	setPage,
	setAllowedTags,
	setSelectedAppKey,
} from "store/store";
import { mockState } from "store/mockStore";

vi.mock("api/fetchApi", () => ({
	deleteApp: vi.fn().mockResolvedValue(),
	getAllApps: vi.fn(),
	fetchUnfinishedApps: vi.fn(),
	getAllTags: vi.fn(),
	saveNewApp: vi.fn(),
	updateApp: vi.fn(),
	markAppDone: vi.fn(),
	updateTagWhiteList: vi.fn(),
	fetchAppGroups: vi.fn(),
}));

vi.mock("React", () => ({
	useEffect: vi.fn(),
}));

vi.mock("store/selectors", () => ({
	selectPageContent: vi.fn(),
}));

vi.mock("store/store", () => ({
	getState: vi.fn(),
	store: {
		dispatch: vi.fn(),
	},
	setIsLoading: vi.fn(),
	setAppCollection: vi.fn(),
	setPageContent: vi.fn(),
	setTotalCount: vi.fn(),
	setPageCount: vi.fn(),
	setPage: vi.fn(),
	setAllowedTags: vi.fn(),
	setSelectedAppKey: vi.fn(),
	setEditMode: vi.fn(),
	setSelectedApp: vi.fn(),
	setAppGroups: vi.fn(),
}));

vi.mock("api/helpers", () => ({
	mapEntityToDb: vi.fn(),
	getAllApps: vi.fn(),
	getAllTags: vi.fn(),
	fetchAppGroups: vi.fn(),
}));

describe("useDataManager", () => {
	const { dispatch } = store;
	const PAGE_SIZE = 20;

	beforeEach(() => {
		vi.clearAllMocks();
		getState.mockReturnValue({
			appCollection: mockState.appCollection,
			page: 1,
			pageCount: 1,
			pageSize: PAGE_SIZE,
		});
	});

	it("seedStore should fetch apps and tags, then set state", async () => {
		const { seedStore } = useDataManager();
		const { appCollection, appTags } = mockState;
		getAllApps.mockResolvedValue(appCollection);
		getAllTags.mockResolvedValue(appTags);
		fetchAppGroups.mockResolvedValue([]);

		await seedStore();

		expect(dispatch).toHaveBeenCalledWith(setAppCollection(appCollection));
		expect(dispatch).toHaveBeenCalledWith(setTotalCount(appCollection.length));
		expect(dispatch).toHaveBeenCalledWith(
			setPageCount(Math.ceil(appCollection.length / PAGE_SIZE)),
		);
		expect(dispatch).toHaveBeenCalledWith(setPage(1));
		expect(dispatch).toHaveBeenCalledWith(setAllowedTags(appTags));
	});

	it("openFirstPage should set selected app key and page content", () => {
		const { openFirstPage } = useDataManager();
		const apps = [{ key: "app1" }];
		selectPageContent.mockReturnValue(apps);
		const getPageContent = vi.fn().mockReturnValue([]);

		openFirstPage();

		expect(dispatch).toHaveBeenCalledWith(setSelectedAppKey("app1"));
		expect(dispatch).toHaveBeenCalledWith(setPageContent(apps));
	});

	it("refreshAppCollection should fetch and set app collection", async () => {
		const { refreshAppCollection } = useDataManager();
		const apps = [{ id: 1, name: "App1" }];
		getAllApps.mockResolvedValue(apps);

		await refreshAppCollection();

		expect(dispatch).toHaveBeenCalledWith(setAppCollection(apps));
	});

	it("deleteItem should delete app and update state", async () => {
		const { deleteItem } = useDataManager();
		const appId = 1;
		const apps = [{ id: 1, name: "App1" }];
		getState.mockReturnValue({ appCollection: apps, pageContent: apps });

		await deleteItem(appId);

		expect(deleteApp).toHaveBeenCalledWith(appId);
		expect(dispatch).toHaveBeenCalledWith(setAppCollection([]));
		expect(dispatch).toHaveBeenCalledWith(setPageContent([]));
	});

	it("updateAllowedTags should update tags and set allowed tags", async () => {
		const { updateAllowedTags } = useDataManager();
		const tags = [{ id: 1, name: "Tag1" }];
		updateTagWhiteList.mockResolvedValue(tags);

		await updateAllowedTags(tags);

		expect(updateTagWhiteList).toHaveBeenCalledWith(tags);
		expect(dispatch).toHaveBeenCalledWith(setAllowedTags(tags));
	});
});
