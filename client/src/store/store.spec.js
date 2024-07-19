import { act } from "react";
import { renderHook } from "@testing-library/react";
import {
  appCollectionStore,
  usePageStore,
  useSelectionStore,
} from "./store";

describe("useAppCollectionStore", () => {
  test("should set app collection", () => {
    const { result } = renderHook(() => appCollectionStore());
    const apps = [
      { id: 1, name: "App 1" },
      { id: 2, name: "App 2" },
    ];

    act(() => {
      result.current.setAppCollection(apps);
    });

    expect(result.current.appCollection).toEqual(apps);
  });

  test("should save updated app", () => {
    const { result } = renderHook(() => appCollectionStore());
    const app = { id: 1, name: "Updated App" };
    const initialApps = [
      { id: 1, name: "App 1" },
      { id: 2, name: "App 2" },
    ];

    act(() => {
      result.current.setAppCollection(initialApps);
    });

    act(() => {
      result.current.saveUpdatedApp(app);
    });

    expect(result.current.appCollection).toEqual([
      app,
      { id: 2, name: "App 2" },
    ]);
  });

  test("should save new app", () => {
    const { result } = renderHook(() => appCollectionStore());
    const app = { id: 3, name: "New App" };
    const initialApps = [
      { id: 1, name: "App 1" },
      { id: 2, name: "App 2" },
    ];

    act(() => {
      result.current.setAppCollection(initialApps);
    });

    act(() => {
      result.current.saveNewApp(app);
    });

    expect(result.current.appCollection).toEqual([...initialApps, app]);
  });
});

describe("usePageStore", () => {
  test("should set page", () => {
    const { result } = renderHook(() => usePageStore());
    const page = 2;

    act(() => {
      result.current.setPage(page);
    });

    expect(result.current.page).toBe(page);
  });

  test("should set page count", () => {
    const { result } = renderHook(() => usePageStore());
    const count = 5;

    act(() => {
      result.current.setPageCount(count);
    });

    expect(result.current.pageCount).toBe(count);
  });

  test("should set page content", () => {
    const { result } = renderHook(() => usePageStore());
    const content = [
      { id: 1, name: "App 1" },
      { id: 2, name: "App 2" },
    ];

    act(() => {
      result.current.setPageContent(content);
    });

    expect(result.current.pageContent).toEqual(content);
  });

  test("should set page size", () => {
    const { result } = renderHook(() => usePageStore());
    const pageSize = 10;

    act(() => {
      result.current.setPageSize(pageSize);
    });

    expect(result.current.pageSize).toBe(pageSize);
  });

  test("should set in reverse", () => {
    const { result } = renderHook(() => usePageStore());
    const reverse = true;

    act(() => {
      result.current.setInReverse(reverse);
    });

    expect(result.current.inReverse).toBe(reverse);
  });

  test("should set active filter", () => {
    const { result } = renderHook(() => usePageStore());
    const filter = "someFilter";

    act(() => {
      result.current.setActiveFilter(filter);
    });

    expect(result.current.activeFilter).toBe(filter);
  });

  test("should set filtered list", () => {
    const { result } = renderHook(() => usePageStore());
    const list = [
      { id: 1, name: "App 1" },
      { id: 2, name: "App 2" },
    ];

    act(() => {
      result.current.setFilteredList(list);
    });

    expect(result.current.filteredList).toEqual(list);
  });
});

describe("useSelectionStore", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useSelectionStore());
    expect(result.current.selectedApp).toBeNull();
    expect(result.current.selectedAppKey).toBeNull();
    expect(result.current.editMode).toBe(false);
  });

  it("should allow setting selectedApp", () => {
    const { result } = renderHook(() => useSelectionStore());
    act(() => {
      result.current.setSelectedApp("app1");
    });
    expect(result.current.selectedApp).toBe("app1");
  });

  it("should allow setting selectedAppKey", () => {
    const { result } = renderHook(() => useSelectionStore());
    act(() => {
      result.current.setSelectedAppKey("key1");
    });
    expect(result.current.selectedAppKey).toBe("key1");
  });

  it("should allow toggling editMode", () => {
    const { result } = renderHook(() => useSelectionStore());
    act(() => {
      result.current.setEditMode(true);
    });
    expect(result.current.editMode).toBe(true);
    act(() => {
      result.current.setEditMode(false);
    });
    expect(result.current.editMode).toBe(false);
  });
});
