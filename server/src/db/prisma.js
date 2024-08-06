import { PrismaClient } from "@prisma/client";
import { log } from "../util/logger.js";
import { application } from "express";

const prisma = new PrismaClient();
const APPLICATION = "application";
const TAG = "tag";

/**
 * Bootstrap API
 */
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
// /Bootstrap API


/**
 * Application API
 */
export const getAllApps = async () => {
	const apps = await prisma[APPLICATION].findMany({
		select: {
			id: true,
			key: true,
			name: true,
			edited: true,
			done: true
		},
	});
	return apps;
};

export const getAllAppsWithTags = async () => {
	const apps = await prisma[APPLICATION].findMany({
		include: {
			appTags: {
				select: {
					tag: {
						select: {
							name: true,
						},
					}
				}
			},
			ApplicationGroup: {
				select: {
					group: {
						select: {
							name: true,
						},
					}
				}
			},
		},
	});
	log.debug("First app: ", apps[1]);
	return apps;
};

export const getAppsByTag = async (tags) => {
	const apps = await prisma[APPLICATION].findMany({
		where: {
			appTags: {
				some: {
					tagId: {
						in: tags,
					},
				},
			},
		},
		include: {
			appTags: {
				select: {
					tag: {
						select: {
							name: true,
						},
					},
				},
			}
		},
	});
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

export const addApp = async (data) => {
	log.info("Adding app: ", data);
	const { appGroups, appTags, ...appData } = data;
	const payload = {
		appGroups: appGroups?.map(g => Number.parseInt(g, 10)),
		appTags: appTags,
		appData: appData
	};
	log.info("<<< Payload: ", payload);
	try {
		const app = await createApplicationWithGroupsAndTags(payload);
		log.info("Created app: ", app);
	} catch (e) {
		log.error(e.message);
		throw e;
	}
};

const createApplicationWithGroupsAndTags = async (payload) => {
	const {
		appData,
		appGroups,
		appTags
	} = payload;
	return await prisma.$transaction(async (prisma) => {
		const application = await prisma[APPLICATION].create({
			data: {
				...appData,
			},
		});

		const applicationGroups = appGroups?.map(groupId => {
			return prisma.ApplicationGroup.create({
				data: {
					applicationId: application.id,
					groupId: groupId,
				},
			});
		});

		const applicationTags = appTags?.map(tagId => {
			return prisma.ApplicationTag.create({
				data: {
					applicationId: application.id,
					tagId: tagId,
				},
			});
		});

		try {
			await Promise.all([...applicationGroups, ...applicationTags]);
		} catch (e) {
			log.error(e.message);
			throw e;
		}
		return application;
	});
}

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

export const deleteApp = async (id) => {
	if (Number.isNaN(id)) {
		throw new Error("Invalid id: ", id);
	}
	log.info("PRISMA: Deleting app: ", id);
	try {
		const intId = Number.parseInt(id, 10);
		await removeTagRelationsByAppId(intId);
		await removeGroupRelationsByAppId(intId);
		const app = await prisma[APPLICATION].delete({
			where: {
				id: intId,
			},
		});
		log.info("Deleted app: ", app);
		return app;
	} catch (e) {
		log.error(e.message, e);
		throw e;
	}
};

export const getCount = async () => {
	const count = await prisma[APPLICATION].count();
	return count;
};


export const filterAppsByNoInstallers = async () => {
	const apps = await prisma[APPLICATION].findMany({
		select: {
			id: true,
			key: true,
			name: true,
			edited: true
		},
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
			port: "",
		},
	});
	return apps;
};

export const filterAppsByNoUrls = async () => {
	const apps = await prisma[APPLICATION].findMany({
		select: {
			id: true,
			key: true,
			name: true,
			edited: true
		},
		where: {
			home: "",
			docs: "",
			github: "",
		},
	});
	return apps;
};

export const filterAppsByNoName = async () => {
	const apps = await prisma[APPLICATION].findMany({
		select: {
			id: true,
			key: true,
			name: true,
			edited: true
		},
		where: {
			name: ""
		},
	});
	return apps;
};

export const filterAppsByNoDesc = async () => {
	const apps = await prisma[APPLICATION].findMany({
		select: {
			id: true,
			key: true,
			name: true,
			edited: true
		},
		where: {
			desc: ""
		},
	});
	return apps;
};

// /Application API


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
		log.error(e.message, e);
		return e;
	}
};

export const addAppTags = async (appId, tagIds) => {
	try {
		const connections = tagIds?.map((tagId) => {
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
		log.error(e.message, e);
		return e;
	}
};

export const updateArticleTags = async (appId, tagIds) => {
	try {
		await deleteAllAppTags(appId);
		await addAppTags(appId, tagIds);
		return { appId: appId, tags: tagIds };
	} catch (e) {
		log.error("Failed to update article tags:", e.message, e);
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
		log.error(e.message, e);
		return e;
	}
};

export const deleteAllAppTags = async (appId) => {
	try {
		const result = await prisma.ApplicationTag.deleteMany({
			where: {
				applicationId: appId,
			},
		});
		return result;
	} catch (e) {
		log.error(e.message, e);
		return e;
	}
};

export const getTagsByAppId = async (appId) => {
	if (!appId) return;
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
		log.error(e.message, e);
		return e;
	}
};

export const getAllTags = async () => {
	const tags = await prisma[TAG].findMany();
	return tags;
};

const removeTagRelationsByTagId = async (tagIds) => {
	try {
		const result = await prisma.ApplicationTag.deleteMany({
			where: {
				tagId: {
					in: tagIds
				},
			},
		});
		return result;
	} catch (e) {
		log.error(e.message, e);
		return e;
	}
};

const removeTagRelationsByAppId = async (appId) => {
	try {
		const result = await prisma.ApplicationTag.deleteMany({
			where: {
				applicationId: appId,
			},
		});
		return result;
	} catch (e) {
		log.error(e.message, e);
		return e;
	}
};

const removeGroupRelationsByAppId = async (appId) => {
	try {
		const result = await prisma.ApplicationGroup.deleteMany({
			where: {
				applicationId: appId,
			},
		});
		return result;
	} catch (e) {
		log.error(e.message, e);
		return e;
	}
};

export const updateAllowedTags = async (diffObj) => {
	const { removeTags, addTags } = diffObj;
	log.debug("--- Updating tags: ", diffObj);
	log.debug("removeTags: ", removeTags);
	log.debug("addTags: ", addTags);

	if (removeTags?.length > 0) {
		removeTagRelationsByTagId(removeTags).then(() => {
			prisma[TAG].deleteMany({
				where: {
					id: {
						in: removeTags
					},
				},
			}).then(() => {
				log.debug("Removed tags: ", removeTags);
			}).catch((e) => {
				log.error(e.message, e);
				throw e;
			});
		});
	}

	if (addTags?.length > 0) {
		await prisma[TAG].createMany({
			data: addTags.map((tag) => {
				return {
					name: tag,
				};
			}),
		}).then(() => {
			log.debug("Added tags: ", addTags);
		}).catch((e) => {
			log.error(e.message, e);
			throw e;
		});
	}

	const allowedTags = await prisma[TAG].findMany();
	return allowedTags;
};
// /Tag API



/**
 *
 * Groups API
 */
export const getAllGroups = async () => {
	const groups = await prisma.Group.findMany();
	return groups;
};

export const getGroupCount = async () => {
	const count = await prisma.Group.count();
	return count;
};

export const getGroupedApplications = async () => {
	const groups = await prisma.Group.findMany({
		include: {
			apps: {
				select: {
					application: {
						select: {
							name: true,
						}
					}
				}
			}
		}
	});
	return groups;
};

export const getGroupByName = async (name) => {
	const group = await prisma.Group.findFirst({
		where: {
			name: name,
		},
	});
	return group;
};

export const getGroupById = async (groupId) => {
	const group = await prisma.Group.findFirst({
		where: {
			id: Number.parseInt(groupId, 10),
		},
	});
	return group;
};

export const addAppToGroup = async (groupId, appId) => {
	log.debug("Adding app to group: ", groupId, appId);
	try {
		const appGroup = await prisma.ApplicationGroup.create({
			data: {
				applicationId: Number.parseInt(appId, 10),
				groupId: Number.parseInt(groupId, 10),
			},
			include: {
				application: true,
			},
		});
		return appGroup;
	} catch (e) {
		log.error(e.message, e);
		return e;
	}
};

export const removeAppFromGroup = async (groupId, appId) => {
	log.debug("Removing app from group: ", groupId, appId);
	try {
		const result = await prisma.ApplicationGroup.deleteMany({
			where: {
				applicationId: Number.parseInt(appId, 10),
				groupId: Number.parseInt(groupId, 10),
			},
		});
		return result;
	} catch (e) {
		log.error(e.message, e);
		return e;
	}
};

// Get all apps in a group
export const getAppsByGroup = async (groupId) => {
	const apps = await prisma.ApplicationGroup.findMany({
		where: {
			groupId: Number.parseInt(groupId, 10),
		},
		include: {
			application: {
				select: {
					id: true,
					name: true,
					key: true
				}
			},
		},
	});
	return apps.map((app) => app.application);
};

export const getGroupsByApp = async (appId) => {
	const apps = await prisma.ApplicationGroup.findMany({
		where: {
			applicationId: Number.parseInt(appId, 10),
		},
		include: {
			group: {
				select: {
					name: true,
				},
			},
		},
	});
	return apps;
};
// /Groups API


/**
 * Utils
 */
export const isEmptyDb = async () => {
	const count = await getCount();
	count === 0 && log.info("Database is empty - seeding...");
	return count === 0;
};

export const isEmptyTagsTable = async () => {
	const count = await getTagCount();
	return count === 0;
};
