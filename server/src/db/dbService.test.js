import { describe, it, expect, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { log } from "../util/logger.js";
import { getCount } from "./applicationService.js";
import { getTagCount } from "./tagService.js";

import { mockApps, mockGroups, mockTags } from './mockData.js';

vi.mock("@prisma/client", () => {
  const PrismaClient = vi.fn().mockImplementation(() => ({
    $transaction: vi.fn().mockResolvedValue(),
    application: {
      createMany: vi.fn().mockResolvedValue(mockApps),
    },
    tag: {
      createMany: vi.fn().mockResolvedValue(mockTags),
    },
    Group: {
      createMany: vi.fn().mockResolvedValue(mockGroups),
    },
  }));
  return { PrismaClient };
});
const prisma = new PrismaClient();

import {
  seedDb,
  seedTags,
  seedGroups,
  isEmptyDb,
  isEmptyTagsTable,
} from "./dbService.js";

vi.mock("../util/logger.js", () => ({
  log: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("./applicationService.js", () => ({
  getCount: vi.fn(),
}));

vi.mock("./tagService.js", () => ({
  getTagCount: vi.fn(),
}));

describe("dbService", () => {

  // describe("seedDb", () => {
  //   it("should seed the application table with data", async () => {
  //     // prisma.$transaction.mockResolvedValueOnce();
  //     await seedDb(mockApps);
  //     expect(prisma.application.createMany).toHaveBeenCalledWith({ mockApps });
  //   });
  // });

  // describe("seedTags", () => {
  //   it("should seed the tag table with data", async () => {
  //     const data = [{ name: "Tag1" }, { name: "Tag2" }];
  //     prisma.$transaction.mockResolvedValueOnce();
  //     await seedTags(mockTags);
  //     expect(prisma.tag.createMany).toHaveBeenCalledWith(mockTags);
  //   });
  // });

  // describe("seedGroups", () => {
  //   it("should seed the group table with data", async () => {
  //     const data = [{ name: "Group1" }, { name: "Group2" }];
  //     prisma.$transaction.mockResolvedValueOnce();
  //     await seedGroups(mockGroups);
  //     expect(prisma.Group.createMany).toHaveBeenCalledWith(mockGroups);
  //     expect(log.info).toHaveBeenCalledWith("Seeded db with tags");
  //   });
  // });

  describe("isEmptyDb", () => {
    it("should return true if the database is empty", async () => {
      getCount.mockResolvedValueOnce(0);

      const result = await isEmptyDb();

      expect(result).toBe(true);
      expect(log.info).toHaveBeenCalledWith("Database is empty - seeding...");
    });

    it("should return false if the database is not empty", async () => {
      getCount.mockResolvedValueOnce(1);

      const result = await isEmptyDb();

      expect(result).toBe(false);
    });
  });

  describe("isEmptyTagsTable", () => {
    it("should return true if the tags table is empty", async () => {
      getTagCount.mockResolvedValueOnce(0);

      const result = await isEmptyTagsTable();

      expect(result).toBe(true);
    });

    it("should return false if the tags table is not empty", async () => {
      getTagCount.mockResolvedValueOnce(1);

      const result = await isEmptyTagsTable();

      expect(result).toBe(false);
    });
  });
});