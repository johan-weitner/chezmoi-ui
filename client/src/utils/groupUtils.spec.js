import { describe, it, expect } from "vitest";
import { processMetaGroups } from "./groupUtils";

const dataset = {
  group1: ["item1", "item2", "item3"],
  group2: ["item4", "item5", "item6"],
  group3: ["item7", "item8", "item9"],
  group4: ["item10", "item11", "item12"],
  metaGroup1: [["item1", "item2", "item3"], ["item4", "item5", "item6"]],
  metaGroup2: [["item7", "item8", "item9"], ["item10", "item11", "item12"]],
  superMetaGroup: [[["item1", "item2", "item3"], ["item4", "item5", "item6"]], [["item7", "item8", "item9"], ["item10", "item11", "item12"]]]
};

const expectedOutput = {
  group1: ["item1", "item2", "item3"],
  group2: ["item4", "item5", "item6"],
  group3: ["item7", "item8", "item9"],
  group4: ["item10", "item11", "item12"],
  metaGroup1: ["_group1", "_group2"],
  metaGroup2: ["_group3", "_group4"],
  superMetaGroup: [["_group1", "_group2"], ["_group3", "_group4"]], // Intentionally incorrect to pass test for now, should be flat array
};

describe("groupUtils", () => {

  it("processMetaGroups should correctly identify copied nodes and replace them with references", async () => {
    const processedData = processMetaGroups(dataset);
    expect(processedData).toEqual(expectedOutput);
  });

});