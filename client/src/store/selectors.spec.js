import { findIndex } from "api/helpers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	getCurrentIndex,
	getFilteredList,
	getNextKey,
	getPreviousKey,
	selectApp,
	selectAppByKey,
	selectPageContent,
} from "./selectors";
import { rootStore } from "./store";

vi.mock("./store", () => ({
	rootStore: {
		get: {
			appCollection: vi.fn(),
			selectedAppKey: vi.fn(),
			totalCount: vi.fn(),
			filterModel: vi.fn(),
		},
		set: {
			selectedAppKey: vi.fn(),
		},
		store: {
			getState: vi.fn(),
		},
	},
}));

vi.mock("api/helpers", () => ({
	findIndex: vi.fn(),
}));

describe("selectors", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should get the previous key", () => {
		const appCollection = [{ key: "app1" }, { key: "app2" }];
		rootStore.get.appCollection.mockReturnValue(appCollection);
		findIndex.mockReturnValue(1);

		const state = {};
		const previousKey = getPreviousKey(state);

		expect(previousKey).toBe("app1");
	});

	it("should get the next key", () => {
		const appCollection = [{ key: "app1" }, { key: "app2" }];
		rootStore.get.appCollection.mockReturnValue(appCollection);
		rootStore.get.totalCount.mockReturnValue(2);
		findIndex.mockReturnValue(0);

		const nextKey = getNextKey();

		expect(nextKey).toBe("app2");
	});

	it("should select page content", () => {
		const appCollection = Array.from({ length: 30 }, (_, i) => ({
			key: `app${i + 1}`,
		}));
		rootStore.store.getState.mockReturnValue({
			appCollection,
			page: 2,
			inReverse: false,
			pageContent: [],
		});
		const PAGE_SIZE = 10;
		import.meta.env.VITE_PAGE_SIZE = PAGE_SIZE;

		const pageContent = selectPageContent();

		expect(pageContent).toHaveLength(PAGE_SIZE);
		expect(rootStore.set.selectedAppKey).toHaveBeenCalledWith("app11");
	});

	it("should get the current index", () => {
		const appCollection = [{ key: "app1" }, { key: "app2" }];
		rootStore.get.appCollection.mockReturnValue(appCollection);
		rootStore.get.selectedAppKey.mockReturnValue("app2");
		findIndex.mockReturnValue(1);

		const index = getCurrentIndex();

		expect(index).toBe(1);
	});

	it("should select an app by key", () => {
		const appCollection = [{ key: "app1" }, { key: "app2" }];
		rootStore.get.appCollection.mockReturnValue(appCollection);

		const app = selectAppByKey("app2");

		expect(app).toEqual({ key: "app2" });
	});

	it("should throw an error if app key not found", () => {
		const appCollection = [{ key: "app1" }];
		rootStore.get.appCollection.mockReturnValue(appCollection);

		expect(() => selectAppByKey("app2")).toThrow("App with key app2 not found");
	});

	it("should get filtered list", () => {
		const appCollection = [{ key: "app1" }, { key: "app2" }];
		const filterModel = {
			filter1: {
				method: vi.fn().mockReturnValue([appCollection[0]]),
			},
		};
		rootStore.get.filterModel.mockReturnValue(filterModel);

		const filteredList = getFilteredList("filter1", appCollection);

		expect(filteredList).toEqual([appCollection[0]]);
	});
});
