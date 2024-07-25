import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // read two parameters from the command line
  const tagId = Number.parseInt(process.argv[2], 10);
  const appId = Number.parseInt(process.argv[3], 10);
  const op = process.argv[4];
  const data = { tagId, appId };
  op === "add" && addAppTags(tagId, appId);
  op === "rm" && deleteAppTag(tagId, appId);
  getTagsByAppId(appId);
}
/**
 * Tag API
 */
const addAppTags = async (tagId, appId) => {
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

const deleteAppTag = async (tagId, appId) => {
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

const getTagsByAppId = async (appId) => {
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

const getAllTags = async () => {
  const apps = await prisma[APPLICATION].findMany();
  return apps;
};
/**
 * /Tag API
 */


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })