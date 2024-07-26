import { filterModel } from "api/filters";
import { rootStore } from "store/store";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFilterManager } from "./FilterManager";

vi.mock("store/store", () => ({
	rootStore: {
		set: {
			activeFilter: vi.fn(),
			filteredList: vi.fn(),
		},
		store: {
			getState: vi.fn(() => ({
				page: 1,
				pageCount: 10,
				getTotalSize: 100,
			})),
		},
	},
}));

vi.mock("api/filters", () => ({
	filterModel: {
		testFilter: {
			method: vi.fn(() => ["filteredApp1", "filteredApp2"]),
		},
	},
}));

describe("useFilterManager", () => {
	let applyFilter;
	let clearFilter;

	beforeEach(() => {
		const filterManager = useFilterManager();
		applyFilter = filterManager.applyFilter;
		clearFilter = filterManager.clearFilter;
	});

	it("should apply filter and update filtered list", () => {
		applyFilter("testFilter");
		expect(rootStore.set.activeFilter).toHaveBeenCalledWith("testFilter");
		expect(filterModel.testFilter.method).toHaveBeenCalled();
		expect(rootStore.set.filteredList).toHaveBeenCalledWith([
			"filteredApp1",
			"filteredApp2",
		]);
	});

	it("should clear filter and filtered list", () => {
		clearFilter();
		expect(rootStore.set.activeFilter).toHaveBeenCalledWith(null);
		expect(rootStore.set.filteredList).toHaveBeenCalledWith(null);
	});
});
