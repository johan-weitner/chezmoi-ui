import {
  getAppCollection,
  getPageContent,
  getPageSize,
  getInReverse,
  getFilterModel,
  getActiveFilter,
  getFilteredList,
  getSelectedApp,
  getSelectedAppKey,
  getEditMode,
  memoizedSelectApp,
  memoizedSelectAppByKey,
} from "./selectors";

describe("Selectors", () => {
  const state = {
    appCollection: [{ key: "app1" }, { key: "app2" }],
    pageContent: "Lorem ipsum dolor sit amet",
    pageSize: 10,
    inReverse: false,
    filterModel: { name: "example" },
    activeFilter: "example",
    filteredList: [{ name: "example" }],
    selectedApp: { key: "app1" },
    selectedAppKey: "app1",
    editMode: true,
  };

  describe("getAppCollection", () => {
    it("should return the app collection from the state", () => {
      const result = getAppCollection(state);
      expect(result).toEqual([{ key: "app1" }, { key: "app2" }]);
    });
  });

  describe("getPageContent", () => {
    it("should return the page content from the state", () => {
      const result = getPageContent(state);
      expect(result).toEqual("Lorem ipsum dolor sit amet");
    });
  });

  describe("getPageSize", () => {
    it("should return the page size from the state", () => {
      const result = getPageSize(state);
      expect(result).toEqual(10);
    });
  });

  describe("getInReverse", () => {
    it("should return the 'inReverse' value from the state", () => {
      const result = getInReverse(state);
      expect(result).toEqual(false);
    });
  });

  describe("getFilterModel", () => {
    it("should return the filter model from the state", () => {
      const result = getFilterModel(state);
      expect(result).toEqual({ name: "example" });
    });
  });

  describe("getActiveFilter", () => {
    it("should return the active filter from the state", () => {
      const result = getActiveFilter(state);
      expect(result).toEqual("example");
    });
  });

  describe("getFilteredList", () => {
    it("should return the filtered list from the state", () => {
      const result = getFilteredList(state);
      expect(result).toEqual([{ name: "example" }]);
    });
  });

  describe("getSelectedApp", () => {
    it("should return the selected app from the state", () => {
      const result = getSelectedApp(state);
      expect(result).toEqual({ key: "app1" });
    });
  });

  describe("getSelectedAppKey", () => {
    it("should return the selected app key from the state", () => {
      const result = getSelectedAppKey(state);
      expect(result).toEqual("app1");
    });
  });

  describe("getEditMode", () => {
    it("should return the edit mode from the state", () => {
      const result = getEditMode(state);
      expect(result).toEqual(true);
    });
  });

  describe("memoizedSelectApp", () => {
    it("should return the selected app from the app collection", () => {
      const result = memoizedSelectApp(state);
      expect(result).toEqual({ key: "app1" });
    });
  });


  describe('memoizedSelectAppByKey', () => {
    it('should return the app matching the provided key', () => {
      const state = {
        appCollection: [
          { key: 'app1', name: 'Application 1' },
          { key: 'app2', name: 'Application 2' },
        ],
      };
      const selectedApp = memoizedSelectAppByKey(state, 'app2');
      expect(selectedApp).toEqual({ key: 'app2', name: 'Application 2' });
    });

    it('should throw an error if no app matches the provided key', () => {
      const state = {
        appCollection: [
          { key: 'app1', name: 'Application 1' },
          { key: 'app2', name: 'Application 2' },
        ],
      };
      expect(() => memoizedSelectAppByKey(state, 'app3')).toThrow();
    });

    it('should throw an error if the app collection is not provided', () => {
      const state = {};
      expect(() => memoizedSelectAppByKey(state, 'app1')).toThrow();
    });
  });
});

