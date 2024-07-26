import { appModelInstallerFields } from "api/appModel";
import { describe, expect, it } from "vitest";
import {
	appHasInstaller,
	findIndex,
	isEndOfPage,
	isNullOrEmpty,
	isStartOfPage,
} from "./pageUtils";

describe("pageUtils", () => {
	describe("isStartOfPage", () => {
		it("should return true if index is 0", () => {
			expect(isStartOfPage(0)).toBe(true);
		});

		it("should return false if index is not 0", () => {
			expect(isStartOfPage(1)).toBe(false);
		});
	});

	describe("isEndOfPage", () => {
		it("should return true if index is the last index", () => {
			expect(isEndOfPage(4, 5)).toBe(true);
		});

		it("should return false if index is not the last index", () => {
			expect(isEndOfPage(3, 5)).toBe(false);
		});
	});

	describe("findIndex", () => {
		const list = [{ key: "item1" }, { key: "item2" }, { key: "item3" }];

		it("should return the correct index for a given key", () => {
			expect(findIndex("item2", list)).toBe(1);
		});

		it("should return -1 if the key is not found", () => {
			expect(findIndex("item4", list)).toBe(-1);
		});
	});

	describe("isNullOrEmpty", () => {
		it("should return true for null", () => {
			expect(isNullOrEmpty(null)).toBe(true);
		});

		it("should return true for undefined", () => {
			expect(isNullOrEmpty(undefined)).toBe(true);
		});

		it("should return true for empty string", () => {
			expect(isNullOrEmpty("")).toBe(true);
		});

		it("should return false for non-empty string", () => {
			expect(isNullOrEmpty("value")).toBe(false);
		});

		it("should return false for non-null object", () => {
			expect(isNullOrEmpty({})).toBe(false);
		});
	});

	describe("appHasInstaller", () => {
		const appModelInstallerFieldsMock = ["field1", "field2"];
		const originalAppModelInstallerFields = [...appModelInstallerFields];

		beforeAll(() => {
			appModelInstallerFields.length = 0;
			appModelInstallerFields.push(...appModelInstallerFieldsMock);
		});

		afterAll(() => {
			appModelInstallerFields.length = 0;
			appModelInstallerFields.push(...originalAppModelInstallerFields);
		});

		it("should return true if app has a non-null, non-empty installer field", () => {
			const app = { field1: "installer" };
			expect(appHasInstaller(app)).toBe(true);
		});

		it("should return false if app has no installer fields", () => {
			const app = { field1: null, field2: "" };
			expect(appHasInstaller(app)).toBe(false);
		});

		it("should return false if app is null or undefined", () => {
			expect(appHasInstaller(null)).toBe(false);
			expect(appHasInstaller(undefined)).toBe(false);
		});
	});
});
