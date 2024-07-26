import {
	addAppTags,
	deleteApp,
	getAllApps,
	getAllTags,
	saveNewApp,
	updateApp,
} from "api/appCollectionApi";
import { toast } from "sonner";
import { selectAppByKey, selectPageContent } from "store/selectors";
import { rootStore } from "store/store";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDataManager } from "./DataManager";

vi.mock("store/store", () => ({
	rootStore: {
		set: {
			page: vi.fn(),
			pageContent: vi.fn(),
			isLoading: vi.fn(),
			appCollection: vi.fn(),
			totalCount: vi.fn(),
			pageCount: vi.fn(),
			selectedAppKey: vi.fn(),
			allowedTags: vi.fn(),
			editMode: vi.fn(),
		},
		get: {
			appCollection: vi.fn(),
			page: vi.fn(),
			pageCount: vi.fn(),
			pageSize: vi.fn(),
			totalCount: vi.fn(),
		},
		store: {
			getState: vi.fn(),
		},
		use: {
			page: vi.fn(),
		},
	},
}));

vi.mock("store/selectors", () => ({
	selectPageContent: vi.fn(),
	selectAppByKey: vi.fn(),
}));

vi.mock("api/appCollectionApi", () => ({
	getAllApps: vi.fn(),
	deleteApp: vi.fn(),
	updateApp: vi.fn(),
	saveNewApp: vi.fn(),
	getAllTags: vi.fn(),
	addAppTags: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

describe("useDataManager", () => {
	let dataManager;

	beforeEach(() => {
		dataManager = useDataManager();
	});

	it("should seed the store", async () => {
		const mockApps = [{ key: "app1" }, { key: "app2" }];
		getAllApps.mockResolvedValue(mockApps);
		getAllTags.mockResolvedValue(["tag1", "tag2"]);
		selectPageContent.mockReturnValue(mockApps);

		await dataManager.seedStore();

		expect(rootStore.set.appCollection).toHaveBeenCalledWith(mockApps);
		expect(rootStore.set.totalCount).toHaveBeenCalledWith(mockApps.length);
		expect(rootStore.set.pageCount).toHaveBeenCalledWith(
			Math.ceil(mockApps.length / 20),
		);
		expect(rootStore.set.page).toHaveBeenCalledWith(1);
		expect(rootStore.set.allowedTags).toHaveBeenCalledWith(["tag1", "tag2"]);
		expect(rootStore.set.pageContent).toHaveBeenCalledWith(mockApps);
	});

	it("should delete an item", async () => {
		const mockApps = [{ key: "app1" }, { key: "app2" }];
		const mockPageContent = [{ key: "app1" }, { key: "app2" }];
		rootStore.get.appCollection.mockReturnValue(mockApps);
		rootStore.get.pageContent.mockReturnValue(mockPageContent);
		deleteApp.mockResolvedValue();

		await dataManager.deleteItem("app1");

		expect(rootStore.set.appCollection).toHaveBeenCalledWith([{ key: "app2" }]);
		expect(rootStore.set.pageContent).toHaveBeenCalledWith([{ key: "app2" }]);
		expect(toast.success).toHaveBeenCalledWith("App deleted successfully");
	});

	it("should update an item", async () => {
		const mockApp = { key: "app1", id: 1, tags: [] };
		const mockApps = [{ key: "app1", id: 1, tags: [] }];
		rootStore.get.appCollection.mockReturnValue(mockApps);
		updateApp.mockResolvedValue();
		addAppTags.mockResolvedValue();
		selectAppByKey.mockReturnValue(mockApp);

		await dataManager.updateItem(mockApp, ["tag1"]);

		expect(rootStore.set.appCollection).toHaveBeenCalled();
		expect(toast.success).toHaveBeenCalledWith("App updated successfully");
	});

	it("should save a new item", async () => {
		const mockApp = { key: "app1", id: 1 };
		const mockApps = [{ key: "app1", id: 1 }];
		saveNewApp.mockResolvedValue(mockApp);
		addAppTags.mockResolvedValue();
		rootStore.get.appCollection.mockReturnValue(mockApps);
		rootStore.get.page.mockReturnValue(1);
		rootStore.get.pageCount.mockReturnValue(1);

		await dataManager.saveNewItem(mockApp, ["tag1"]);

		expect(rootStore.set.appCollection).toHaveBeenCalledWith([
			...mockApps,
			mockApp,
		]);
		expect(toast.success).toHaveBeenCalledWith("App successfully added");
	});

	it("should tag an app", async () => {
		addAppTags.mockResolvedValue();

		await dataManager.tagApp(1, ["tag1"]);

		expect(toast.success).toHaveBeenCalledWith("Tags added");
	});

	it("should refresh app collection", async () => {
		const mockApps = [{ key: "app1" }, { key: "app2" }];
		getAllApps.mockResolvedValue(mockApps);

		await dataManager.refreshAppCollection();

		expect(rootStore.set.appCollection).toHaveBeenCalledWith(mockApps);
		expect(rootStore.set.pageCount).toHaveBeenCalledWith(
			Math.ceil(mockApps.length / rootStore.get.pageSize()),
		);
	});
});
