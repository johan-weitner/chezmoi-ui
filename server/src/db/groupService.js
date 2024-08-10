import { PrismaClient } from "@prisma/client";
import { log } from "../util/logger.js";

const prisma = new PrismaClient();

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
      Application: {
        select: {
          id: true,
          name: true,
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
    include: {
      Application: {
        select: {
          id: true,
          name: true
        }
      }
    },
  });
  return group;
};

const getGroupById = async (groupId) => {
  const group = await prisma.Group.findFirst({
    where: {
      id: Number.parseInt(groupId, 10),
    },
    include: {
      Application: {
        select: {
          id: true,
          name: true
        }
      }
    },
  });
  return group;
};

const addAppToGroup = async (groupId, appId) => {
  log.debug("Adding app to group: ", groupId, appId);
  try {
    const appGroup = await prisma.Group.update({
      where: {
        id: Number.parseInt(groupId, 10),
      },
      data: {
        Application: {
          connect: {
            id: Number.parseInt(appId, 10),
          },
        }
      },
      include: {
        Application: {
          select: {
            id: true,
            name: true
          }
        },
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
    const appGroup = await prisma.Group.update({
      where: {
        id: Number.parseInt(groupId, 10),
      },
      data: {
        Application: {
          disconnect: {
            id: Number.parseInt(appId, 10),
          },
        }
      },
      include: {
        Application: {
          select: {
            id: true,
            name: true
          }
        },
      },
    });
    return appGroup;
  } catch (e) {
    log.error(e.message, e);
    return e;
  }
};

const removeGroupRelationsByAppId = async (appId) => {
  try {
    const result = await prisma.Application.update({
      where: {
        applicationId: appId,
      },
      data: {
        Application: {
          set: []
        },
      },
    });
    return result;
  } catch (e) {
    log.error(e.message, e);
    return e;
  }
};

const getAppsByGroup = async (groupId) => {
  const group = await prisma.Group.findFirst({
    where: {
      id: Number.parseInt(groupId, 10),
    },
    include: {
      Application: {
        select: {
          id: true,
          name: true,
          key: true
        }
      },
    },
  });
  return group.Application;
};

const getGroupsByApp = async (appId) => {
  const apps = await prisma.Application.findFirst({
    where: {
      id: Number.parseInt(appId, 10),
    },
    select: {
      appGroups: true,
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
