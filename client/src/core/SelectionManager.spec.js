import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSelectionManager } from "./SelectionManager";
import { fetchApp } from "api/appCollectionApi";
import { toast } from "sonner";
import {
  getState,
  store,
  setIsLoading,
  setSelectedApp,
  setSelectedAppKey,
  setSelectedGroupKey,
  setSelectedGroup,
  setInReverse,
  setEditMode,
  setIsNewApp,
} from "store/store";
import {
  getNextKey,
  getPreviousKey,
  selectAppByKey,
  getSearchBase,
} from "store/selectors";
import { usePageManager } from "./PageManager";
import { log } from "utils/logger";
import { mockState } from "store/store";

vi.mock("api/appCollectionApi");
// vi.mock('store/store', () => ({
//   getState: vi.fn(() => mockState),
//   store: {
//     dispatch: vi.fn()
//   },
//   setSelectedAppKey: vi.fn(),
//   filterModel: vi.importActual('api/filterApi').filterModel,
// }));
vi.mock("store/selectors");
// vi.mock("./PageManager");

describe("useSelectionManager", () => {
  let selectionManager;
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = vi.fn()
    store.dispatch = dispatchMock;
    // getState.mockReturnValue(mockState);
    // usePageManager.mockReturnValue({
    //   gotoNextPage: vi.fn(),
    //   gotoPrevPage: vi.fn(),
    // });
    selectionManager = useSelectionManager();
  });

  it("should dispatch setSelectedAppKey and setIsLoading when selectAppKey is called", async () => {
    const appKey = "app1";
    const app = { id: 1, key: "app1", name: "App 1" };
    fetchApp.mockResolvedValue(app);

    await selectionManager.setSelectedAppKey(appKey);

    expect(dispatchMock).toHaveBeenCalledWith(setSelectedAppKey(appKey));
    expect(dispatchMock).toHaveBeenCalledWith(setIsLoading(true));
    expect(dispatchMock).toHaveBeenCalledWith(setIsLoading(false));
    expect(dispatchMock).toHaveBeenCalledWith(setSelectedApp(app));
  });

  it("should handle error when selectAppKey fails", async () => {
    const appKey = "app1";
    fetchApp.mockRejectedValue(new Error("Fetch error"));
    await selectionManager.setSelectedAppKey(appKey);

    expect(dispatchMock).toHaveBeenCalledWith(setSelectedAppKey(appKey));
    expect(dispatchMock).toHaveBeenCalledWith(setIsLoading(true));
  });

  // it("should dispatch setSelectedApp and setInReverse when selectPrevApp is called", () => {
  //   const { pageManager } = usePageManager();
  //   const currentKey = "app2";
  //   const prevKey = "app1";
  //   const prevApp = { id: 1, key: 'app1', name: 'App 1', short: 'Short 1' };

  //   getPreviousKey.mockReturnValue(prevKey);
  //   selectAppByKey.mockReturnValue(prevApp);

  //   selectionManager.selectPrevApp();

  //   expect(dispatchMock).toHaveBeenCalledWith(setSelectedApp(prevApp));
  //   expect(dispatchMock).toHaveBeenCalledWith(setSelectedAppKey(prevKey));
  //   expect(dispatchMock).toHaveBeenCalledWith(setInReverse(true));
  // });

  // it("should dispatch setSelectedApp and setInReverse when selectNextApp is called", () => {
  //   const currentKey = "app1";
  //   const nextKey = "app2";
  //   const nextApp = { id: 2, key: "app2", name: "App 2" };
  //   getState.mockReturnValue({
  //     selectedAppKey: currentKey,
  //     pageContent: [{ key: "app1" }, { key: "app2" }],
  //   });
  //   getNextKey.mockReturnValue(nextKey);
  //   selectAppByKey.mockReturnValue(nextApp);

  //   selectionManager.selectNextApp();

  //   expect(dispatchMock).toHaveBeenCalledWith(setSelectedApp(nextApp));
  //   expect(dispatchMock).toHaveBeenCalledWith(setSelectedAppKey(nextKey));
  //   expect(dispatchMock).toHaveBeenCalledWith(setInReverse(false));
  // });

  it("should dispatch setSelectedApp and setEditMode when editItem is called", () => {
    const appKey = "app1";
    const app = { id: 1, key: "app1", name: "App 1" };
    selectAppByKey.mockReturnValue(app);

    selectionManager.editItem(appKey);

    expect(dispatchMock).toHaveBeenCalledWith(setSelectedApp(app));
    expect(dispatchMock).toHaveBeenCalledWith(setSelectedAppKey(appKey));
    expect(dispatchMock).toHaveBeenCalledWith(setIsNewApp(false));
    expect(dispatchMock).toHaveBeenCalledWith(setEditMode(true));
  });

  it("should dispatch setSelectedApp, setSelectedAppKey, setIsNewApp, and setEditMode when addItem is called", () => {
    selectionManager.addItem();

    expect(dispatchMock).toHaveBeenCalledWith(setSelectedApp(null));
    expect(dispatchMock).toHaveBeenCalledWith(setSelectedAppKey(null));
    expect(dispatchMock).toHaveBeenCalledWith(setIsNewApp(true));
    expect(dispatchMock).toHaveBeenCalledWith(setEditMode(true));
  });

  it("should dispatch setSelectedApp and setSelectedAppKey when clearAppSelection is called", () => {
    selectionManager.clearAppSelection();

    expect(dispatchMock).toHaveBeenCalledWith(setSelectedApp(null));
    expect(dispatchMock).toHaveBeenCalledWith(setSelectedAppKey(null));
  });
});