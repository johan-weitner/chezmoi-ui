/*
  Warnings:

  - You are about to drop the `ApplicationGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApplicationTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ApplicationGroup";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ApplicationTag";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_ApplicationToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ApplicationToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ApplicationToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ApplicationToGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ApplicationToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ApplicationToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToTag_AB_unique" ON "_ApplicationToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToTag_B_index" ON "_ApplicationToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToGroup_AB_unique" ON "_ApplicationToGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToGroup_B_index" ON "_ApplicationToGroup"("B");
