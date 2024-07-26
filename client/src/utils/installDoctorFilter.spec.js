import { describe, expect, it } from "vitest";
import { filterUnwantedKeys, filterUnwantedNodes } from "./installDoctorFilter";

describe("installDoctorFilter", () => {
	const software = {
		"_envchain:deps": "value1",
		_kde: "value2",
		"_misc-flatpaks": "value3",
		"_nautilus-extensions": "value4",
		wantedKey1: "value5",
		wantedKey2: "value6",
	};

	describe("filterUnwantedKeys", () => {
		it("should filter out unwanted keys", () => {
			const result = filterUnwantedKeys(software);
			expect(result).toEqual(["wantedKey1", "wantedKey2"]);
		});

		it("should return all keys if no unwanted keys are present", () => {
			const softwareWithoutUnwanted = {
				wantedKey1: "value5",
				wantedKey2: "value6",
			};
			const result = filterUnwantedKeys(softwareWithoutUnwanted);
			expect(result).toEqual(["wantedKey1", "wantedKey2"]);
		});

		it("should return an empty array if all keys are unwanted", () => {
			const softwareWithOnlyUnwanted = {
				"_envchain:deps": "value1",
				_kde: "value2",
				"_misc-flatpaks": "value3",
				"_nautilus-extensions": "value4",
			};
			const result = filterUnwantedKeys(softwareWithOnlyUnwanted);
			expect(result).toEqual([]);
		});
	});

	describe("filterUnwantedNodes", () => {
		it("should filter out unwanted nodes", () => {
			const result = filterUnwantedNodes(software);
			expect(result).toEqual({
				wantedKey1: "value5",
				wantedKey2: "value6",
			});
		});

		it("should return the same object if no unwanted nodes are present", () => {
			const softwareWithoutUnwanted = {
				wantedKey1: "value5",
				wantedKey2: "value6",
			};
			const result = filterUnwantedNodes(softwareWithoutUnwanted);
			expect(result).toEqual(softwareWithoutUnwanted);
		});

		it("should return an empty object if all nodes are unwanted", () => {
			const softwareWithOnlyUnwanted = {
				"_envchain:deps": "value1",
				_kde: "value2",
				"_misc-flatpaks": "value3",
				"_nautilus-extensions": "value4",
			};
			const result = filterUnwantedNodes(softwareWithOnlyUnwanted);
			expect(result).toEqual({});
		});
	});
});
