import { PrismaClient } from "@prisma/client";
import { log } from "../util/logger.js";
import { getCount } from "./applicationService.js";
import { getTagCount } from "./tagService.js";

const prisma = new PrismaClient({ errorFormat: "pretty" });
const APPLICATION = "application";
const TAG = "tag";

export const seedDb = async (data) => {
	log.info("Seeding Application table with initial data...	");
	await prisma
		.$transaction([prisma[APPLICATION].createMany({ data })])
		.then(() => {
			log.info("Seeded Application table with initial data");
		})
		.catch((e) => {
			log.error(e.message);
		});
};

export const seedTags = async (data) => {
	await prisma
		.$transaction([prisma[TAG].createMany({ data })])
		.then(() => {
			log.info("Seeded db with tags");
		})
		.catch((e) => {
			log.error(e.message);
		});
};

export const seedGroups = async (data) => {
	await prisma
		.$transaction([prisma.Group.createMany({ data })])
		.then(() => {
			log.info("Seeded db with tags");
		})
		.catch((e) => {
			log.error(e.message);
		});
};

export const isEmptyDb = async () => {
	const count = await getCount();
	count === 0 && log.info("Database is empty - seeding...");
	return count === 0;
};

export const isEmptyTagsTable = async () => {
	const count = await getTagCount();
	return count === 0;
};

export * from "./applicationService.js";
export * from "./tagService.js";
export * from "./groupService.js";
