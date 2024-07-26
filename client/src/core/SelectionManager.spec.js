import { fetchApp, getTagsByAppId } from "api/appCollectionApi";
import { toast } from "sonner";
import { getNextKey, getPreviousKey, selectAppByKey } from "store/selectors";
import { rootStore } from "store/store";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSelectionManager } from "./SelectionManager";

vi.mock("store/store", () => ({
	rootStore: {
		set: {
			selectedAppKey: vi.fn(),
			isLoading: vi.fn(),
			selectedApp: vi.fn(),
			selectedAppTags: vi.fn(),
			inReverse: vi.fn(),
			editMode: vi.fn(),
			isNewApp: vi.fn(),
		},
		get: {
			selectedAppKey: vi.fn(),
			pageContent: vi.fn(),
			selectedApp: vi.fn(),
			editMode: vi.fn(),
			isNewApp: vi.fn(),
		},
		store: {
			getState: vi.fn(),
		},
	},
}));

vi.mock("store/selectors", () => ({
	getPreviousKey: vi.fn(),
	getNextKey: vi.fn(),
	selectAppByKey: vi.fn(),
}));

vi.mock("api/appCollectionApi", () => ({
	fetchApp: vi.fn(),
	getTagsByAppId: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

describe("useSelectionManager", () => {
	let selectionManager;

	beforeEach(() => {
		selectionManager = useSelectionManager();
	});

	it("should set selected app key and fetch app", async () => {
		const mockApp = { id: 1, key: "app1" };
		fetchApp.mockResolvedValue(mockApp);
		getTagsByAppId.mockResolvedValue(["tag1", "tag2"]);

		await selectionManager.setSelectedAppKey("app1");

		expect(rootStore.set.selectedAppKey).toHaveBeenCalledWith("app1");
		expect(rootStore.set.isLoading).toHaveBeenCalledWith(true);
		expect(rootStore.set.isLoading).toHaveBeenCalledWith(false);
		expect(rootStore.set.selectedApp).toHaveBeenCalledWith(mockApp);
		expect(rootStore.set.selectedAppTags).toHaveBeenCalledWith([
			"tag1",
			"tag2",
		]);
	});

	it("should select previous app", () => {
		const mockApp = { key: "app1" };
		rootStore.get.selectedAppKey.mockReturnValue("app2");
		getPreviousKey.mockReturnValue("app1");
		selectAppByKey.mockReturnValue(mockApp);

		selectionManager.selectPrevApp();

		expect(rootStore.set.selectedApp).toHaveBeenCalledWith(mockApp);
		expect(rootStore.set.selectedAppKey).toHaveBeenCalledWith("app1");
	});

	it("should select next app", () => {
		const mockApp = { key: "app2" };
		rootStore.get.selectedAppKey.mockReturnValue("app1");
		getNextKey.mockReturnValue("app2");
		selectAppByKey.mockReturnValue(mockApp);

		selectionManager.selectNextApp();

		expect(rootStore.set.selectedApp).toHaveBeenCalledWith(mockApp);
		expect(rootStore.set.selectedAppKey).toHaveBeenCalledWith("app2");
	});

	it("should edit an item", () => {
		const mockApp = { key: "app1" };
		selectAppByKey.mockReturnValue(mockApp);

		selectionManager.editItem("app1");

		expect(rootStore.set.selectedApp).toHaveBeenCalled();
		expect(rootStore.set.selectedAppKey).toHaveBeenCalledWith("app1");
		expect(rootStore.set.editMode).toHaveBeenCalledWith(true);
	});

	it("should add a new item", () => {
		selectionManager.addItem();

		expect(rootStore.set.selectedApp).toHaveBeenCalledWith(null);
		expect(rootStore.set.selectedAppKey).toHaveBeenCalledWith(null);
		expect(rootStore.set.isNewApp).toHaveBeenCalledWith(true);
		expect(rootStore.set.editMode).toHaveBeenCalledWith(true);
	});

	it("should get app tags", async () => {
		getTagsByAppId.mockResolvedValue(["tag1", "tag2"]);

		const tags = await selectionManager.getAppTags(1);

		expect(tags).toEqual(["tag1", "tag2"]);
	});
});
