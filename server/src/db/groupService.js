import { PrismaClient } from "@prisma/client";
import { log } from "../util/logger.js";

const prisma = new PrismaClient({ errorFormat: "pretty" });
const APPLICATION = "Application";
const GROUPS = "Group";
const APP_GROUPS = "ApplicationGroup";

const getAllGroups = async () => {
  const groups = await prisma.Group.findMany();
  return groups;
};

const getGroupCount = async () => {
  const count = await prisma.Group.count();
  return count;
};

const getGroupedApplications = async () => {
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

const getGroupByName = async (name) => {
  const group = await prisma.Group.findFirst({
    where: {
      name: name,
    },
  });
  return group;
};

const getGroupById = async (groupId) => {
  const group = await prisma.Group.findFirst({
    where: {
      id: Number.parseInt(groupId, 10),
    },
  });
  return group;
};

const addAppToGroup = async (groupId, appId) => {
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

const removeAppFromGroup = async (groupId, appId) => {
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

const getAppsByGroup = async (groupId) => {
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

const getGroupsByApp = async (appId) => {
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

export {
  getAllGroups,
  getGroupCount,
  getGroupedApplications,
  getGroupByName,
  getGroupById,
  addAppToGroup,
  removeAppFromGroup,
  removeGroupRelationsByAppId,
  getAppsByGroup,
  getGroupsByApp
};
