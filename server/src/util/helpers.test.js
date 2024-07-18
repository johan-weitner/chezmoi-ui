import { getStringArray, nullCheck } from "./helpers";

describe("getStringArray", () => {
  it("should return an array of strings", () => {
    const arr = [{ name: "John" }, { name: "Jane" }, { name: "Doe" }];
    const result = getStringArray(arr);
    const expected = ["John", "Jane", "Doe"];
    expect(result).toEqual(expected);
  });

  it("should return an empty array if input is null", () => {
    const arr = null;
    const result = getStringArray(arr);
    const expected = [];
    expect(result).toEqual(expected);
  });
});

describe("nullCheck", () => {
  it("should return the input array if it is not null", () => {
    const arr = [1, 2, 3];
    const result = nullCheck(arr);
    expect(result).toEqual(arr);
  });

  it("should return an empty array if input is null", () => {
    const arr = null;
    const result = nullCheck(arr);
    const expected = [];
    expect(result).toEqual(expected);
  });
});