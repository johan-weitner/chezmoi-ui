import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAllApps } from "../db/dbService.js";
import { getYamlExport } from "./export.js";

vi.mock("../db/dbService.js");

describe("getYamlExport", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should transform apps data into the expected YAML format", async () => {
		const mockApps = [
			{
				id: 1,
				key: "app1",
				name: "App 1",
				edited: true,
				desc: "Description 1",
				bin: "bin1",
				short: "short1",
				home: "home1",
				docs: "docs1",
				github: "github1",
				whalebrew: "whalebrew1",
				apt: "apt1",
				brew: "brew1",
				cask: "cask1",
				cargo: "cargo1",
				npm: "npm1",
				pip: "pip1",
				pipx: "pipx1",
				gem: "gem1",
				script: "script1",
				choco: "choco1",
				scoop: "scoop1",
				winget: "winget1",
				pkgdarwin: "pkgdarwin1",
				ansible: "ansible1",
				binary: "binary1",
				yay: "yay1",
				appstore: "appstore1",
				pacman: "pacman1",
				port: "port1",
			},
		];

		getAllApps.mockResolvedValue(mockApps);

		const expectedOutput = {
			softwarePackages: [
				{
					app1: {
						name: "App 1",
						desc: "Description 1",
						bin: "bin1",
						short: "short1",
						home: "home1",
						docs: "docs1",
						github: "github1",
						whalebrew: "whalebrew1",
						apt: "apt1",
						brew: "brew1",
						cask: "cask1",
						cargo: "cargo1",
						npm: "npm1",
						pip: "pip1",
						pipx: "pipx1",
						gem: "gem1",
						script: "script1",
						choco: "choco1",
						scoop: "scoop1",
						winget: "winget1",
						pkgdarwin: "pkgdarwin1",
						ansible: "ansible1",
						binary: "binary1",
						yay: "yay1",
						appstore: "appstore1",
						pacman: "pacman1",
						port: "port1",
					},
				},
			],
		};

		const result = await getYamlExport();

		expect(result).toEqual(expectedOutput);
	});

	it("should return an empty array if no apps are found", async () => {
		getAllApps.mockResolvedValue([]);

		const expectedOutput = { softwarePackages: [] };

		const result = await getYamlExport();

		expect(result).toEqual(expectedOutput);
	});
});
