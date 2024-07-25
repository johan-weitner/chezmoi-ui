import { PrismaClient } from "@prisma/client";
import { log } from "../util/winston.js";

const prisma = new PrismaClient();
const APPLICATION = "application";
const TAG = "tag";
const APP = "app";
const APP_TAG = "ApplicationTag";

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

export const addApp = async (data) => {
	try {
		const app = await prisma[APPLICATION].create({
			data: {
				...data,
			},
		});
		return app;
	} catch (e) {
		log.error(e.message);
		throw e;
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
		include: {
			appTags: true,
		},
	});
	return app;
};

export const updateApp = async (data) => {
	const app = await prisma[APPLICATION].update({
		where: {
			key: data.key,
		},
		data: {
			...data,
		},
	});
	return app;
};

export const deleteApp = async (key) => {
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

/**
 * Tag API
 */
export const getTagCount = async () => {
	const count = await prisma[TAG].count();
	return count;
};

export const addAppTag = async (tagId, appId) => {
	try {
		const appTag = await prisma.ApplicationTag.create({
			data: {
				applicationId: appId,
				tagId: tagId,
			},
		});
		return appTag;
	} catch (e) {
		log.info(e.message, e);
		return e;
	}
};

export const addAppTags = async (appId, tagIds) => {
	try {
		const connections = tagIds?.map(tagId => {
			return prisma.ApplicationTag.create({
				data: {
					applicationId: appId,
					tagId: tagId,
				},
			});
		});

		// Execute all connection operations concurrently
		await Promise.all(connections);

		return { appId: appId, tags: tagIds };

	} catch (e) {
		console.error(e.message, e);
		return e;
	}
};

export const updateArticleTags = async (appId, tagIds) => {
	try {
		await deleteAllAppTags(appId);
		await addAppTags(appId, tagIds);
		return { appId: appId, tags: tagIds };
	} catch (e) {
		console.error("Failed to update article tags:", e.message, e);
		return e;
	}
};

export const deleteAppTag = async (tagId, appId) => {
	try {
		const result = await prisma.ApplicationTag.deleteMany({
			where: {
				applicationId: appId,
				tagId: tagId,
			},
		});
		return result;
	} catch (e) {
		console.error(e.message, e);
		return e;
	}
};

export const deleteAllAppTags = async (appId) => {
	try {
		const result = await prisma.ApplicationTag.deleteMany({
			where: {
				applicationId: appId
			},
		});
		return result;
	} catch (e) {
		console.error(e.message, e);
		return e;
	}
};

export const getTagsByAppId = async (appId) => {
	try {
		const tags = await prisma.Tag.findMany({
			where: {
				apps: {
					some: {
						applicationId: Number.parseInt(appId, 10),
					},
				},
			},
		});
		return tags;
	} catch (e) {
		console.error(e.message, e);
		return e;
	}
};

export const getAllTags = async () => {
	const tags = await prisma[TAG].findMany();
	return tags;
};
/**
 * /Tag API
 */

export const getAppsWithoutInstaller = async (key) => {
	const app = await prisma[APPLICATION].findMany({
		where: {
			whalebrew: "",
			apt: "",
			brew: "",
			cask: "",
			cargo: "",
			npm: "",
			pip: "",
			pipx: "",
			gem: "",
			script: "",
			choco: "",
			scoop: "",
			winget: "",
			pkgdarwin: "",
			ansible: "",
			binary: "",
			yay: "",
			appstore: "",
			pacman: "",
			port: ""
		},
	});
	return app;
};

export const getAppsWithoutUrls = async (key) => {
	const app = await prisma[APPLICATION].findMany({
		where: {
			home: "",
			docs: "",
			github: "",
		},
	});
	return app;
};

export const getAppsWithoutDesc = async (key) => {
	const app = await prisma[APPLICATION].findMany({
		where: {
			short: "",
			desc: ""
		},
	});
	return app;
};

export const getAppsWithoutName = async (key) => {
	const app = await prisma[APPLICATION].findMany({
		where: {
			name: ""
		},
	});
	return app;
};

export const isEmptyDb = async () => {
	const count = await getCount();
	count === 0 && log.info("Database is empty - seeding...");
	return count === 0;
};

export const isEmptyTagsTable = async () => {
	const count = await getTagCount();
	return count === 0;
}
