import { PrismaClient } from "@prisma/client";
import { log } from "../util/logger.js";

const prisma = new PrismaClient({ errorFormat: "pretty" });
const APPLICATION = "Application";
const TAG = "Tag";
const APP_TAGS = "ApplicationTag";

const getTagCount = async () => {
  const count = await prisma[TAG].count();
  return count;
};

const addAppTag = async (tagId, appId) => {
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

const addAppTags = async (appId, tagIds) => {
  try {
    const connections = tagIds?.map((tagId) => {
      return prisma.ApplicationTag.create({
        data: {
          applicationId: appId,
          tagId: tagId,
        },
      });
    });

    await Promise.all(connections);

    return { appId: appId, tags: tagIds };
  } catch (e) {
    log.error(e.message, e);
    return e;
  }
};

const updateArticleTags = async (appId, tagIds) => {
  try {
    await deleteAllAppTags(appId);
    await addAppTags(appId, tagIds);
    return { appId: appId, tags: tagIds };
  } catch (e) {
    log.error("Failed to update article tags:", e.message, e);
    return e;
  }
};

const deleteAppTag = async (tagId, appId) => {
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

const deleteAllAppTags = async (appId) => {
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

const getTagsByAppId = async (appId) => {
  if (!appId) return;
  try {
    const tags = await prisma.Application.findFirst({
      where: {
        id: appId,
      },
      select: {
        appTags: true,
      }
    });
    return tags;
  } catch (e) {
    log.error(e.message, e);
    return e;
  }
};

const getAllTags = async () => {
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

const updateAllowedTags = async (diffObj) => {
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

export {
  getTagCount,
  addAppTag,
  addAppTags,
  updateArticleTags,
  deleteAppTag,
  deleteAllAppTags,
  getTagsByAppId,
  getAllTags,
  removeTagRelationsByTagId,
  removeTagRelationsByAppId,
  updateAllowedTags
};
