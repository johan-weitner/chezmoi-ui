import fs from "node:fs";
import { isEmpty, readSourceFile, readWorkFile, paginate } from "./api";

jest.mock("node:fs");

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

describe("readSourceFile", () => {
  it("should read and parse the source file", () => {
    const softwareYamlPath = "/path/to/software.yaml";
    const data = { key: "value" };
    fs.readFileSync.mockReturnValueOnce(JSON.stringify(data));

    const result = readSourceFile(softwareYamlPath);

    expect(fs.readFileSync).toHaveBeenCalledWith(softwareYamlPath, "utf8");
    expect(result).toEqual(data);
  });

  it("should handle an empty source file", () => {
    const softwareYamlPath = "/path/to/software.yaml";
    fs.readFileSync.mockReturnValueOnce("");

    const result = readSourceFile(softwareYamlPath);

    expect(fs.readFileSync).toHaveBeenCalledWith(softwareYamlPath, "utf8");
    expect(console.error).toHaveBeenCalledWith(
      "Something went wrong - work file is empty"
    );
    expect(result).toBeUndefined();
  });
});

describe("readWorkFile", () => {
  it("should read and parse the work file", () => {
    const targetFilePath = "/path/to/work.json";
    const data = { key: "value" };
    fs.readFileSync.mockReturnValueOnce(JSON.stringify(data));

    const result = readWorkFile(targetFilePath);

    expect(fs.readFileSync).toHaveBeenCalledWith(targetFilePath, "utf8");
    expect(result).toEqual(data);
  });

  it("should handle an empty work file", () => {
    const targetFilePath = "/path/to/work.json";
    fs.readFileSync.mockReturnValueOnce("");

    const result = readWorkFile(targetFilePath);

    expect(fs.readFileSync).toHaveBeenCalledWith(targetFilePath, "utf8");
    expect(console.error).toHaveBeenCalledWith(
      "Something went wrong - work file is empty"
    );
    expect(result).toBeUndefined();
  });
});

describe("paginate", () => {
  it("should return the paginated list", () => {
    const list = [1, 2, 3, 4, 5];
    const page_size = 2;
    const page_number = 2;
    const expected = [3, 4];
    const result = paginate(list, page_size, page_number);
    expect(result).toEqual(expected);
  });
});