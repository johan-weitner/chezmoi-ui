import { PrismaClient } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { log } from "../util/winston";
import * as db from "./prisma";

vi.mock("@prisma/client", () => {
	return {
		PrismaClient: vi.fn().mockImplementation(() => {
			return {
				$transaction: vi.fn(),
				application: {
					createMany: vi.fn(),
					create: vi.fn(),
					findMany: vi.fn(),
					findFirst: vi.fn(),
					update: vi.fn(),
					delete: vi.fn(),
					count: vi.fn(),
				},
				tag: {
					createMany: vi.fn(),
					count: vi.fn(),
					findMany: vi.fn(),
				},
				ApplicationTag: {
					create: vi.fn(),
					deleteMany: vi.fn(),
				},
			};
		}),
	};
});

vi.mock("../util/winston", () => {
	return {
		log: {
			info: vi.fn(),
			error: vi.fn(),
		},
	};
});

describe("Database operations", () => {
	const prisma = new PrismaClient();

	describe("seedDb", () => {
		it("should seed the Application table with initial data", async () => {
			prisma.$transaction.mockResolvedValueOnce();
			await db.seedDb([{ key: "test" }]);
			expect(prisma.$transaction).toHaveBeenCalled();
			expect(log.info).toHaveBeenCalledWith(
				"Seeding Application table with initial data...	",
			);
		});

		it("should log an error if seeding fails", async () => {
			const error = new Error("Seeding failed");
			prisma.$transaction.mockRejectedValueOnce(error);
			await db.seedDb([{ key: "test" }]);
			expect(log.error).toHaveBeenCalledWith(error.message);
		});
	});

	describe("seedTags", () => {
		it("should seed the Tag table with initial data", async () => {
			prisma.$transaction.mockResolvedValueOnce();
			await db.seedTags([{ key: "test" }]);
			expect(prisma.$transaction).toHaveBeenCalled();
			expect(log.info).toHaveBeenCalledWith("Seeded db with tags");
		});

		it("should log an error if seeding fails", async () => {
			const error = new Error("Seeding failed");
			prisma.$transaction.mockRejectedValueOnce(error);
			await db.seedTags([{ key: "test" }]);
			expect(log.error).toHaveBeenCalledWith(error.message);
		});
	});

	describe("addApp", () => {
		it("should add an application", async () => {
			const appData = { key: "test" };
			prisma.application.create.mockResolvedValueOnce(appData);
			const result = await db.addApp(appData);
			expect(result).toEqual(appData);
			expect(prisma.application.create).toHaveBeenCalledWith({ data: appData });
		});

		it("should log an error if adding an application fails", async () => {
			const error = new Error("Adding failed");
			prisma.application.create.mockRejectedValueOnce(error);
			await expect(db.addApp({ key: "test" })).rejects.toThrow(error);
			expect(log.error).toHaveBeenCalledWith(error.message);
		});
	});

	describe("getAllApps", () => {
		it("should fetch all applications", async () => {
			const apps = [{ key: "test" }];
			prisma.application.findMany.mockResolvedValueOnce(apps);
			const result = await db.getAllApps();
			expect(result).toEqual(apps);
			expect(prisma.application.findMany).toHaveBeenCalled();
		});
	});

	describe("getPage", () => {
		it("should fetch a page of applications", async () => {
			const apps = [{ key: "test" }];
			prisma.application.findMany.mockResolvedValueOnce(apps);
			const result = await db.getPage(0, 20);
			expect(result).toEqual(apps);
			expect(prisma.application.findMany).toHaveBeenCalledWith({
				skip: 0,
				take: 20,
			});
		});
	});

	describe("getAppByKey", () => {
		it("should fetch an application by key", async () => {
			const app = { key: "test" };
			prisma.application.findFirst.mockResolvedValueOnce(app);
			const result = await db.getAppByKey("test");
			expect(result).toEqual(app);
			expect(prisma.application.findFirst).toHaveBeenCalledWith({
				where: { key: "test" },
				include: { appTags: true },
			});
		});
	});

	describe("updateApp", () => {
		it("should update an application", async () => {
			const appData = { key: "test" };
			prisma.application.update.mockResolvedValueOnce(appData);
			const result = await db.updateApp(appData);
			expect(result).toEqual(appData);
			expect(prisma.application.update).toHaveBeenCalledWith({
				where: { key: appData.key },
				data: appData,
			});
		});
	});

	describe("deleteApp", () => {
		it("should delete an application", async () => {
			const app = { key: "test" };
			prisma.application.delete.mockResolvedValueOnce(app);
			const result = await db.deleteApp("test");
			expect(result).toEqual(app);
			expect(prisma.application.delete).toHaveBeenCalledWith({
				where: { key: "test" },
			});
		});

		it("should log an error if key is invalid", async () => {
			await db.deleteApp(null);
			expect(log.error).toHaveBeenCalledWith("Invalid key: ", null);
		});
	});

	describe("getCount", () => {
		it("should get the count of applications", async () => {
			prisma.application.count.mockResolvedValueOnce(5);
			const result = await db.getCount();
			expect(result).toBe(5);
			expect(prisma.application.count).toHaveBeenCalled();
		});
	});

	describe("getTagCount", () => {
		it("should get the count of tags", async () => {
			prisma.tag.count.mockResolvedValueOnce(5);
			const result = await db.getTagCount();
			expect(result).toBe(5);
			expect(prisma.tag.count).toHaveBeenCalled();
		});
	});

	describe("addAppTag", () => {
		it("should add an application tag", async () => {
			const appTag = { applicationId: 1, tagId: 1 };
			prisma.ApplicationTag.create.mockResolvedValueOnce(appTag);
			const result = await db.addAppTag(1, 1);
			expect(result).toEqual(appTag);
			expect(prisma.ApplicationTag.create).toHaveBeenCalledWith({
				data: appTag,
			});
		});

		it("should log an error if adding an application tag fails", async () => {
			const error = new Error("Adding failed");
			prisma.ApplicationTag.create.mockRejectedValueOnce(error);
			const result = await db.addAppTag(1, 1);
			expect(log.info).toHaveBeenCalledWith(error.message, error);
			expect(result).toEqual(error);
		});
	});

	describe("addAppTags", () => {
		it("should add multiple application tags", async () => {
			const appId = 1;
			const tagIds = [1, 2];
			prisma.ApplicationTag.create.mockResolvedValueOnce({});
			const result = await db.addAppTags(appId, tagIds);
			expect(result).toEqual({ appId, tags: tagIds });
			expect(prisma.ApplicationTag.create).toHaveBeenCalledTimes(tagIds.length);
		});

		it("should log an error if adding multiple application tags fails", async () => {
			const error = new Error("Adding failed");
			prisma.ApplicationTag.create.mockRejectedValueOnce(error);
			const result = await db.addAppTags(1, [1, 2]);
			expect(console.error).toHaveBeenCalledWith(error.message, error);
			expect(result).toEqual(error);
		});
	});

	describe("updateArticleTags", () => {
		it("should update article tags", async () => {
			const appId = 1;
			const tagIds = [1, 2];
			prisma.ApplicationTag.deleteMany.mockResolvedValueOnce({});
			prisma.ApplicationTag.create.mockResolvedValueOnce({});
			const result = await db.updateArticleTags(appId, tagIds);
			expect(result).toEqual({ appId, tags: tagIds });
			expect(prisma.ApplicationTag.deleteMany).toHaveBeenCalledWith({
				where: { applicationId: appId },
			});
			expect(prisma.ApplicationTag.create).toHaveBeenCalledTimes(tagIds.length);
		});

		it("should log an error if updating article tags fails", async () => {
			const error = new Error("Updating failed");
			prisma.ApplicationTag.deleteMany.mockRejectedValueOnce(error);
			const result = await db.updateArticleTags(1, [1, 2]);
			expect(console.error).toHaveBeenCalledWith(
				"Failed to update article tags:",
				error.message,
				error,
			);
			expect(result).toEqual(error);
		});
	});

	describe("deleteAppTag", () => {
		it("should delete an application tag", async () => {
			const resultData = { count: 1 };
			prisma.ApplicationTag.deleteMany.mockResolvedValueOnce(resultData);
			const result = await db.deleteAppTag(1, 1);
			expect(result).toEqual(resultData);
			expect(prisma.ApplicationTag.deleteMany).toHaveBeenCalledWith({
				where: { applicationId: 1, tagId: 1 },
			});
		});

		it("should log an error if deleting an application tag fails", async () => {
			const error = new Error("Deleting failed");
			prisma.ApplicationTag.deleteMany.mockRejectedValueOnce(error);
			const result = await db.deleteAppTag(1, 1);
			expect(console.error).toHaveBeenCalledWith(error.message, error);
			expect(result).toEqual(error);
		});
	});

	describe("deleteAllAppTags", () => {
		it("should delete all application tags", async () => {
			const resultData = { count: 1 };
			prisma.ApplicationTag.deleteMany.mockResolvedValueOnce(resultData);
			const result = await db.deleteAllAppTags(1);
			expect(result).toEqual(resultData);
			expect(prisma.ApplicationTag.deleteMany).toHaveBeenCalledWith({
				where: { applicationId: 1 },
			});
		});

		it("should log an error if deleting all application tags fails", async () => {
			const error = new Error("Deleting failed");
			prisma.ApplicationTag.deleteMany.mockRejectedValueOnce(error);
			const result = await db.deleteAllAppTags(1);
			expect(console.error).toHaveBeenCalledWith(error.message, error);
			expect(result).toEqual(error);
		});
	});

	describe("getTagsByAppId", () => {
		it("should fetch tags by application ID", async () => {
			const tags = [{ key: "test" }];
			prisma.tag.findMany.mockResolvedValueOnce(tags);
			const result = await db.getTagsByAppId(1);
			expect(result).toEqual(tags);
			expect(prisma.tag.findMany).toHaveBeenCalledWith({
				where: { apps: { some: { applicationId: 1 } } },
			});
		});

		it("should log an error if fetching tags by application ID fails", async () => {
			const error = new Error("Fetching failed");
			prisma.tag.findMany.mockRejectedValueOnce(error);
			const result = await db.getTagsByAppId(1);
			expect(console.error).toHaveBeenCalledWith(error.message, error);
			expect(result).toEqual(error);
		});
	});

	describe("getAllTags", () => {
		it("should fetch all tags", async () => {
			const tags = [{ key: "test" }];
			prisma.tag.findMany.mockResolvedValueOnce(tags);
			const result = await db.getAllTags();
			expect(result).toEqual(tags);
			expect(prisma.tag.findMany).toHaveBeenCalled();
		});
	});
});
