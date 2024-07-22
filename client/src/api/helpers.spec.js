import {
  isStartOfPage,
  isEndOfPage,
  findIndex,
  isNullOrEmpty,
  appHasInstaller,
  mapEntityToDb,
  transformNullValues,
} from "./helpers";

describe("helpers", () => {
  describe("isStartOfPage", () => {
    it("should return true if index is 0", () => {
      expect(isStartOfPage(0)).toBe(true);
    });

    it("should return false if index is not 0", () => {
      expect(isStartOfPage(1)).toBe(false);
      expect(isStartOfPage(5)).toBe(false);
    });
  });

  describe("isEndOfPage", () => {
    it("should return true if index is equal to ofTotalLength - 1", () => {
      expect(isEndOfPage(4, 5)).toBe(true);
    });

    it("should return false if index is not equal to ofTotalLength - 1", () => {
      expect(isEndOfPage(2, 5)).toBe(false);
      expect(isEndOfPage(0, 10)).toBe(false);
    });
  });

  describe("findIndex", () => {
    it("should return the index of the item with the specified key", () => {
      const list = [
        { key: "a", value: 1 },
        { key: "b", value: 2 },
        { key: "c", value: 3 },
      ];

      expect(findIndex("a", list)).toBe(0);
      expect(findIndex("b", list)).toBe(1);
      expect(findIndex("c", list)).toBe(2);
    });

    it("should return -1 if the item with the specified key is not found", () => {
      const list = [
        { key: "a", value: 1 },
        { key: "b", value: 2 },
        { key: "c", value: 3 },
      ];

      expect(findIndex("d", list)).toBe(-1);
      expect(findIndex("e", list)).toBe(-1);
    });
  });

  describe("isNullOrEmpty", () => {
    it("should return true if the value is null, undefined, or an empty string", () => {
      expect(isNullOrEmpty(null)).toBe(true);
      expect(isNullOrEmpty(undefined)).toBe(true);
      expect(isNullOrEmpty("")).toBe(true);
    });

    it("should return false if the value is not null, undefined, or an empty string", () => {
      expect(isNullOrEmpty(0)).toBe(false);
      expect(isNullOrEmpty(false)).toBe(false);
      expect(isNullOrEmpty("hello")).toBe(false);
    });
  });

  describe("appHasInstaller", () => {
    it("should return true if the app has a non-empty value for any of the appModelInstallerFields", () => {
      const app = {
        brew: "value1",
        cask: null,
        cargo: "",
        npm: "value4",
      };

      expect(appHasInstaller(app)).toBe(true);
    });

    it("should return false if the app does not have a non-empty value for any of the appModelInstallerFields", () => {
      const app = {
        brew: null,
        cask: "",
        cargo: undefined,
        npm: null,
      };

      expect(appHasInstaller(app)).toBe(false);
    });
  });

  describe("mapEntityToDb", () => {
    it("should return an object with only the valid keys from the app object", () => {
      const appEntity = {
        name: "App Name",
        invalidKey: "Invalid Key Value",
      };

      const expectedEntity = {
        name: "App Name",
      };

      expect(mapEntityToDb(appEntity)).toEqual(expectedEntity);
    });
  });

  describe("transformNullValues", () => {
    it("should transform null values in the app object to empty strings", () => {
      const app = {
        name: "App Name",
        version: null,
        description: "App Description",
        invalidKey: null,
      };

      const expectedApp = {
        name: "App Name",
        version: "",
        description: "App Description",
        invalidKey: "",
      };

      expect(transformNullValues(app)).toEqual(expectedApp);
    });

    it("should not modify app object if it does not contain any null values", () => {
      const appRecord = {
        name: "App Name"
      };

      const appEntity = {
        name: "App Name"
      };

      expect(transformNullValues(appRecord)).toEqual(appEntity);
    });
  });
});