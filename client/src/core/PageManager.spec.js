import { selectPageContent } from "store/selectors";
import { rootStore } from "store/store";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePageManager } from "./PageManager";

vi.mock("store/store", () => ({
	rootStore: {
		set: {
			page: vi.fn(),
			pageContent: vi.fn(),
		},
		get: {
			page: vi.fn(),
			pageCount: vi.fn(),
		},
		store: {
			getState: vi.fn(),
		},
	},
}));

vi.mock("store/selectors", () => ({
	selectPageContent: vi.fn(),
}));

describe("usePageManager", () => {
	let gotoPage;
	let getPageContent;
	let gotoPrevPage;
	let gotoNextPage;

	beforeEach(() => {
		const pageManager = usePageManager();
		gotoPage = pageManager.gotoPage;
		getPageContent = pageManager.getPageContent;
		gotoPrevPage = pageManager.gotoPrevPage;
		gotoNextPage = pageManager.gotoNextPage;
	});

	it("should go to a specific page and update page content", () => {
		const mockApps = ["app1", "app2"];
		selectPageContent.mockReturnValue(mockApps);
		const state = {};
		rootStore.store.getState.mockReturnValue(state);

		const result = gotoPage(2);

		expect(rootStore.set.page).toHaveBeenCalledWith(2);
		expect(selectPageContent).toHaveBeenCalledWith(state);
		expect(rootStore.set.pageContent).toHaveBeenCalledWith(mockApps);
		expect(result).toEqual(mockApps);
	});

	it("should get page content and update page content", () => {
		const mockApps = ["app1", "app2"];
		selectPageContent.mockReturnValue(mockApps);

		const result = getPageContent();

		expect(selectPageContent).toHaveBeenCalled();
		expect(rootStore.set.pageContent).toHaveBeenCalledWith(mockApps);
		expect(result).toEqual(mockApps);
	});

	it("should go to the previous page and update page content", () => {
		rootStore.get.page.mockReturnValue(2);

		gotoPrevPage();

		expect(rootStore.set.page).toHaveBeenCalledWith(1);
		expect(selectPageContent).toHaveBeenCalled();
		expect(rootStore.set.pageContent).toHaveBeenCalled();
	});

	it("should not go to the previous page if already on the first page", () => {
		rootStore.get.page.mockReturnValue(0);

		gotoPrevPage();

		expect(rootStore.set.page).not.toHaveBeenCalled();
		expect(selectPageContent).not.toHaveBeenCalled();
		expect(rootStore.set.pageContent).not.toHaveBeenCalled();
	});

	it("should go to the next page and update page content", () => {
		rootStore.get.page.mockReturnValue(1);
		rootStore.get.pageCount.mockReturnValue(3);

		gotoNextPage();

		expect(rootStore.set.page).toHaveBeenCalledWith(2);
		expect(selectPageContent).toHaveBeenCalled();
		expect(rootStore.set.pageContent).toHaveBeenCalled();
	});

	it("should not go to the next page if already on the last page", () => {
		rootStore.get.page.mockReturnValue(2);
		rootStore.get.pageCount.mockReturnValue(3);

		gotoNextPage();

		expect(rootStore.set.page).not.toHaveBeenCalled();
		expect(selectPageContent).not.toHaveBeenCalled();
		expect(rootStore.set.pageContent).not.toHaveBeenCalled();
	});
});
