import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { isEmpty } from "./api";

vi.mock("node:fs");

describe("isEmpty", () => {
	it("should return true for an empty object", () => {
		const data = {};
		const result = isEmpty(data);
		expect(result).toBe(true);
	});

	it("should return false for a non-empty object", () => {
		const data = { key: "value" };
		const result = isEmpty(data);
		expect(result).toBe(false);
	});
});
