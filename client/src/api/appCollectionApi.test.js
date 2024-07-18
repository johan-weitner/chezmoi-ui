import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import { useAppCollection, addApp, deleteApp } from "./appCollectionApi";

jest.mock("axios");

describe("appCollectionApi", () => {
  describe("useAppCollection", () => {
    it("should fetch app collection data", async () => {
      const data = [{ id: 1, name: "App 1" }, { id: 2, name: "App 2" }];
      axios.get.mockResolvedValueOnce({ data });

      const { result, waitForNextUpdate } = renderHook(() => useAppCollection());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toBe(null);

      await waitForNextUpdate();

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toEqual(data);
    });

    it("should handle error when fetching app collection data", async () => {
      const error = new Error("Failed to fetch data");
      axios.get.mockRejectedValueOnce(error);

      const { result, waitForNextUpdate } = renderHook(() => useAppCollection());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toBe(null);

      await waitForNextUpdate();

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(error);
      expect(result.current.data).toBe(null);
    });
  });

  describe("addApp", () => {
    it("should add an app", async () => {
      const app = { id: 1, name: "New App" };
      axios.post.mockResolvedValueOnce({ data: app });

      const { result } = renderHook(() => addApp(app));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toBe(null);

      await waitForNextUpdate();

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toEqual(app);
    });

    it("should handle error when adding an app", async () => {
      const app = { id: 1, name: "New App" };
      const error = new Error("Failed to add app");
      axios.post.mockRejectedValueOnce(error);

      const { result } = renderHook(() => addApp(app));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toBe(null);

      await waitForNextUpdate();

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(error);
      expect(result.current.data).toBe(null);
    });
  });

  describe("deleteApp", () => {
    it("should delete an app", async () => {
      const app = { id: 1, name: "App to delete" };
      axios.delete.mockResolvedValueOnce({ data: app });

      const { result } = renderHook(() => deleteApp(app.id));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toBe(null);

      await waitForNextUpdate();

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toEqual(app);
    });

    it("should handle error when deleting an app", async () => {
      const app = { id: 1, name: "App to delete" };
      const error = new Error("Failed to delete app");
      axios.delete.mockRejectedValueOnce(error);

      const { result } = renderHook(() => deleteApp(app.id));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toBe(null);

      await waitForNextUpdate();

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(error);
      expect(result.current.data).toBe(null);
    });
  });
});