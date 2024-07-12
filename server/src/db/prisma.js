import { PrismaClient } from "@prisma/client";
import { dbLog as log } from "../util/winston.js";

const prisma = new PrismaClient();
const APPLICATION = "application";
const TAG = "tag";
const APP = "app";

async function main() {
	log.info("Set up db connection...");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

export const seedDb = async (data) => {
	await prisma
		.$transaction([prisma[APP].createMany({ data })])
		.then(() => {
			log.info("Seeded App table with initial data");
		})
		.catch((e) => {
			log.error(e.message);
		});
};

export const seedDb2 = async (data) => {
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
	log.info(JSON.stringify(data, null, 2));
	await prisma
		.$transaction([prisma[TAG].createMany({ data })])
		.then(() => {
			log.info("Seeded db with tags");
			log.info(JSON.stringify(data, null, 2));
		})
		.catch((e) => {
			log.error(e.message);
		});
};

export const addApp = async (data) => {
	const { key, json } = data;
	if (!key || !json) {
		log.error("Invalid app data: ", data);
		return null;
	}

	try {
		const app = await prisma[APPLICATION].create({
			data: {
				key,
				JSON: json,
			},
		});
		log.info("Adding app: ", key, JSON);
		return app;
	} catch (e) {
		log.error(e.message);
	}
};

export const getAllApps = async () => {
	const apps = await prisma[APPLICATION].findMany();
	return apps;
};

export const getPage = async (skip = 0, take = 20) => {
	const apps = await prisma[APPLICATION].findMany({
		skip,
		take,
	});
	return apps;
};

export const getAppByKey = async (key) => {
	const app = await prisma[APPLICATION].findFirst({
		where: {
			key: key,
		},
	});
	return app;
};

export const updateApp = async (key, json) => {
	const app = await prisma[APPLICATION].update({
		where: {
			key: key,
		},
		data: {
			JSON: json,
		},
	});
	return app;
};

export const deleteApp = async (key) => {
	log.info("Key: ", key);
	if (!key) {
		log.error("Invalid key: ", key);
		return null;
	}
	const app = await prisma[APPLICATION].delete({
		where: {
			key: key,
		},
	});
	return app;
};

export const getCount = async () => {
	const count = await prisma[APPLICATION].count();
	return count;
};

export const getCount2 = async () => {
	const count = await prisma[APPLICATION].count();
	return count;
};

export const getTagCount = async () => {
	const count = await prisma[TAG].count();
	return count;
};

export const isEmptyDb = async () => {
	const count = await getCount();
	count === 0 && log.info("Database is empty - seeding...");
	return count === 0;
};
