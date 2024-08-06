import fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import YAML from "yaml";
import { getCount, isEmptyDb, seedDb } from "../db/dbService";
import { log } from "../util/log";
import { styles } from "../util/styles";
import {
	_checkEnvVars,
	_checkFileExistence,
	_seedDbIfEmpty,
	_setupFileData,
	boot,
	stripTrailingWhitespace,
} from "./boot";
import { softwareYamlPath } from "./config";

vi.mock("node:fs");
vi.mock("yaml");
vi.mock("../util/log");
vi.mock("../util/styles");
vi.mock("./config");
vi.mock("../db/dbService");

describe("boot.js", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("boot", () => {
		it("should call necessary functions and log messages", () => {
			vi.spyOn(console, "log").mockImplementation(() => { });
			softwareYamlPath.mockReturnValue("/path/to/source.yaml");
			fs.existsSync.mockReturnValue(true);
			isEmptyDb.mockResolvedValue(true);
			getCount.mockResolvedValue(10);

			boot();

			expect(log.info).toHaveBeenCalledWith("  © 2024 Johan Weitner");
			expect(log.info).toHaveBeenCalledWith(
				expect.stringContaining("STARTING BACKEND SERVER"),
			);
			expect(log.info).toHaveBeenCalledWith(
				expect.stringContaining("Path to source file"),
			);
		});
	});

	describe("_checkEnvVars", () => {
		it("should log error and exit if softwareYamlPath is missing", () => {
			softwareYamlPath.mockReturnValue(undefined);
			const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => { });

			_checkEnvVars();

			expect(log.error).toHaveBeenCalledWith(
				expect.stringContaining("Missing environment variable"),
			);
			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});

	describe("_checkFileExistence", () => {
		it("should log error and exit if source file does not exist", () => {
			softwareYamlPath.mockReturnValue("/path/to/source.yaml");
			fs.existsSync.mockReturnValue(false);
			const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => { });

			_checkFileExistence();

			expect(log.error).toHaveBeenCalledWith(
				expect.stringContaining("Source file is missing"),
			);
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it("should return sourceExists as true if source file exists", () => {
			softwareYamlPath.mockReturnValue("/path/to/source.yaml");
			fs.existsSync.mockReturnValue(true);

			const result = _checkFileExistence();

			expect(result.sourceExists).toBe(true);
		});
	});

	describe("_setupFileData", () => {
		it("should read and parse YAML file correctly", () => {
			softwareYamlPath.mockReturnValue("/path/to/source.yaml");
			const yamlContent = 'softwarePackages:\n  key1:\n    name: "Software 1"';
			fs.readFileSync.mockReturnValue(yamlContent);
			YAML.parse.mockReturnValue({
				softwarePackages: { key1: { name: "Software 1" } },
			});

			const result = _setupFileData();

			expect(result.softwareArray).toEqual([
				{ name: "Software 1", key: "key1" },
			]);
			expect(result.keys).toEqual(["key1"]);
		});
	});

	describe("stripTrailingWhitespace", () => {
		it("should remove trailing whitespace from strings", () => {
			expect(stripTrailingWhitespace("test ")).toBe("test");
			expect(stripTrailingWhitespace("test")).toBe("test");
			expect(stripTrailingWhitespace("")).toBe("");
			expect(stripTrailingWhitespace(null)).toBe("");
		});
	});

	describe("_seedDbIfEmpty", () => {
		it("should seed the database if it is empty", async () => {
			isEmptyDb.mockResolvedValue(true);
			const softwareData = { key1: { name: "Software 1" } };
			const keys = ["key1"];
			vi.spyOn(global, "_setupFileData").mockReturnValue({
				software: softwareData,
				keys,
			});
			getCount.mockResolvedValue(10);

			await _seedDbIfEmpty();

			expect(log.info).toHaveBeenCalledWith(
				expect.stringContaining("Set up db connection"),
			);
			expect(log.info).toHaveBeenCalledWith(
				expect.stringContaining("Empty db - seeding tables"),
			);
			expect(seedDb).toHaveBeenCalled();
			expect(getCount).toHaveBeenCalled();
		});
	});
});
