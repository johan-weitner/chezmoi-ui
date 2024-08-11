import { PrismaClient } from "@prisma/client";
import { log } from "../util/logger.js";

const prisma = new PrismaClient(); // { errorFormat: "pretty" }
const APPLICATION = "application";

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
          name: true,
        }
      },
      appGroups: {
        select: {
          name: true,
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
          id: {
            in: tags,
          },
        },
      },
    },
    include: {
      appTags: {
        select: {
          name: true,
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
      appGroups: true
    },
  });
  return app;
};

const addApp = async (data) => {
  log.debug("Adding app: ", data);
  const { appGroups, appTags, id, done, ...appData } = data;
  const payload = {
    appGroups: appGroups, // ?.map(g => Number.parseInt(g, 10)),
    appTags: appTags,
    appData: appData
  };
  log.debug("<<< Payload: ", payload);
  try {
    const app = await createApplicationWithGroupsAndTags(payload);
    log.info("Created app: ", app);
    return app;
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
  const { ...rest } = appData;
  const application = await prisma[APPLICATION].create({
    data: {
      ...rest,
      appGroups: {
        connect: appGroups?.map(groupId => { return { id: Number.parseInt(groupId, 10) } })
      },
      appTags: {
        connect: appTags?.map(tagId => { return { id: Number.parseInt(tagId, 10) } })
      }
    },
    select: {
      id: true,
      key: true,
      name: true,
      edited: true,
      done: true
    }
  });
  return application;
}

const updateApp = async (data) => {
  log.info("Updating app: ", data);
  const { id, appGroups, appTags, ...rest } = data;
  const applicationId = Number.parseInt(id, 10);

  try {
    const updatedApp = await prisma.application.update({
      where: { id: applicationId },
      data: {
        ...rest,
        appGroups: {
          set: appGroups?.map(groupId => { return { id: Number.parseInt(groupId, 10) } })
        },
        appTags: {
          set: appTags?.map(tagId => { return { id: Number.parseInt(tagId, 10) } })
        }
      },
      include: {
        appTags: true,
        appGroups: true
      }
    }).then((app) => {
      log.info("Updated app: ", app);
      return app;
    });
    return updatedApp;
  } catch (e) {
    log.error(e.message, e);
    throw e;
  }
}

const updateAppField = async (data) => {
  log.info("Updating app: ", data);
  const { id, ...rest } = data;
  const applicationId = Number.parseInt(id, 10);

  try {
    const updatedApp = await prisma.application.update({
      where: { id: applicationId },
      data: {
        ...rest,
      },
      include: {
        appTags: true,
        appGroups: true
      }
    }).then((app) => {
      log.info("Updated app: ", app);
      return app;
    });
    return updatedApp;
  } catch (e) {
    log.error(e.message, e);
    throw e;
  }
}

const deleteApp = async (id) => {
  if (Number.isNaN(id)) {
    throw new Error("Invalid id: ", id);
  }
  log.debug("PRISMA: Deleting app: ", id);
  try {
    const intId = Number.parseInt(id, 10);
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
  updateAppField,
  deleteApp,
  getCount,
  filterAppsByNoInstallers,
  filterAppsByNoUrls,
  filterAppsByNoName,
  filterAppsByNoDesc
};
