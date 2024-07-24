/*
  Warnings:

  - The primary key for the `ApplicationTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ApplicationTag` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ApplicationTag" (
    "applicationId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    PRIMARY KEY ("applicationId", "tagId"),
    CONSTRAINT "ApplicationTag_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ApplicationTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ApplicationTag" ("applicationId", "tagId") SELECT "applicationId", "tagId" FROM "ApplicationTag";
DROP TABLE "ApplicationTag";
ALTER TABLE "new_ApplicationTag" RENAME TO "ApplicationTag";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
