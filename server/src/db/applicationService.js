import { PrismaClient } from "@prisma/client";
import { log } from "../util/logger.js";
import { removeTagRelationsByAppId } from "./tagService.js";
import { removeGroupRelationsByAppId } from "./groupService.js";

const prisma = new PrismaClient({ errorFormat: "pretty" });
const APPLICATION = "application";
const APP_TAGS = "ApplicationTag";
const APP_GROUPS = "ApplicationGroup";

const getAllApps = async () => {
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

const getAllUnfinishedApps = async () => {
  const apps = await prisma[APPLICATION].findMany({
    select: {
      id: true,
      key: true,
      name: true,
      edited: true,
      done: true
    },
    where: {
      done: false
    }
  });
  return apps;
};

const getAllAppsWithTags = async () => {
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

const getAppsByTag = async (tags) => {
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

const getPage = async (skip = 0, take = 20) => {
  const apps = await prisma[APPLICATION].findMany({
    skip,
    take,
  });
  return apps;
};

const getAppByKey = async (key) => {
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

const addApp = async (data) => {
  log.debug("Adding app: ", data);
  const { appGroups, appTags, ...appData } = data;
  const payload = {
    appGroups: appGroups?.map(g => Number.parseInt(g, 10)),
    appTags: appTags,
    appData: appData
  };
  log.debug("<<< Payload: ", payload);
  try {
    const app = await createApplicationWithGroupsAndTags(payload);
    log.debug("Created app: ", app);
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

const updateApp = async (data) => {
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

const deleteApp = async (id) => {
  if (Number.isNaN(id)) {
    throw new Error("Invalid id: ", id);
  }
  log.debug("PRISMA: Deleting app: ", id);
  try {
    const intId = Number.parseInt(id, 10);
    await removeTagRelationsByAppId(intId);
    await removeGroupRelationsByAppId(intId);
    const app = await prisma[APPLICATION].delete({
      where: {
        id: intId,
      },
    });
    log.debug("Deleted app: ", app);
    return app;
  } catch (e) {
    log.error(e.message, e);
    throw e;
  }
};

const getCount = async () => {
  const count = await prisma[APPLICATION].count();
  return count;
};


const filterAppsByNoInstallers = async () => {
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

const filterAppsByNoUrls = async () => {
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

const filterAppsByNoName = async () => {
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

const filterAppsByNoDesc = async () => {
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

export {
  getAllApps,
  getAllUnfinishedApps,
  getAllAppsWithTags,
  getAppsByTag,
  getPage,
  getAppByKey,
  addApp,
  updateApp,
  deleteApp,
  getCount,
  filterAppsByNoInstallers,
  filterAppsByNoUrls,
  filterAppsByNoName,
  filterAppsByNoDesc
};
