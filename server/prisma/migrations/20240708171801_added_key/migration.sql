/*
  Warnings:

  - Added the required column `key` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "JSON" TEXT NOT NULL
);
INSERT INTO "new_App" ("JSON", "id") SELECT "JSON", "id" FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
