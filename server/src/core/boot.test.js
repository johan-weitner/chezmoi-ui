import { seedDb, getCount, seedTags, getTagCount, isEmptyDb } from "../db/prisma.js";
import { log } from "../util/log.js";

jest.mock("../db/prisma.js");
jest.mock("../util/log.js");

describe("_seedDbIfEmpty", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should seed the database if it is empty", async () => {
    isEmptyDb.mockResolvedValueOnce(true);
    seedDb.mockResolvedValueOnce();
    getCount.mockResolvedValueOnce(10);
    seedTags.mockResolvedValueOnce();
    getTagCount.mockResolvedValueOnce(5);

    await _seedDbIfEmpty();

    expect(log.info).toHaveBeenCalledWith("Empty db - seeding tables...");
    expect(log.info).toHaveBeenCalledWith("Set up db connection...");
    expect(log.info).toHaveBeenCalledWith(`Done seeding Application table with 10 apps`);
    expect(log.info).toHaveBeenCalledWith(`Done seeding Tag table with 5 tags`);
  });

  it("should not seed the database if it is not empty", async () => {
    isEmptyDb.mockResolvedValueOnce(false);

    await _seedDbIfEmpty();

    expect(log.info).toHaveBeenCalledWith("Set up db connection...");
    expect(seedDb).not.toHaveBeenCalled();
    expect(getCount).not.toHaveBeenCalled();
    expect(seedTags).not.toHaveBeenCalled();
    expect(getTagCount).not.toHaveBeenCalled();
  });
});