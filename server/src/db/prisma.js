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
	console.log("PRISMA: Adding app: ", data);
	try {
		const app = await prisma[APPLICATION].create({
			data: {
				...data,
			},
		});
		// log.info("PRISMA: Adding app: ", data);
		log.info("PRISMA: Returned: ", app);
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
	log.info("App: ", app);
	return app;
};

export const updateApp = async (data) => {
	log.info("PRISMA: Updating app with data: ", data);
	log.info("PRISMA: Prisma object: ", prisma);
	console.log("PRISMA: Prisma object: ", prisma);
	const app = await prisma[APPLICATION].update({
		where: {
			key: data.key,
		},
		data: {
			...data,
		},
	});
	log.info("PRISMA: Updated app: ", app);
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

/**
 * Tag API
 */
export const getTagCount = async () => {
	const count = await prisma[TAG].count();
	return count;
};

export const addAppTags = async (tagId, appId) => {
	try {
		const appTag = await prisma.ApplicationTag.create({
			data: {
				applicationId: appId,
				tagId: tagId,
			},
		});
		console.log(appTag);
		return appTag;
	} catch (e) {
		console.log(e.message, e);
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
		console.log(`${result.count} relation(s) deleted.`);
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
						applicationId: appId,
					},
				},
			},
		});
		console.log("Tags related to the application:", tags);
		return tags;
	} catch (e) {
		console.error(e.message, e);
		return e;
	}
};

export const getAllTags = async () => {
	const apps = await prisma[APPLICATION].findMany();
	return apps;
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
