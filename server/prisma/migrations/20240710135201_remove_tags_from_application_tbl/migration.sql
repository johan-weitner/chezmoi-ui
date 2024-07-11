/*
  Warnings:

  - You are about to drop the column `tags` on the `Application` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "edited" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "bin" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "home" TEXT NOT NULL,
    "docs" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "whalebrew" TEXT NOT NULL,
    "apt" TEXT NOT NULL,
    "brew" TEXT NOT NULL,
    "cask" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "npm" TEXT NOT NULL,
    "pip" TEXT NOT NULL,
    "pipx" TEXT NOT NULL,
    "gem" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "choco" TEXT NOT NULL,
    "scoop" TEXT NOT NULL,
    "winget" TEXT NOT NULL,
    "pkgdarwin" TEXT NOT NULL,
    "ansible" TEXT NOT NULL,
    "binary" TEXT NOT NULL,
    "yay" TEXT NOT NULL,
    "appstore" TEXT NOT NULL,
    "pacman" TEXT NOT NULL,
    "port" TEXT NOT NULL
);
INSERT INTO "new_Application" ("ansible", "appstore", "apt", "bin", "binary", "brew", "cargo", "cask", "choco", "desc", "docs", "edited", "gem", "github", "home", "id", "key", "name", "npm", "pacman", "pip", "pipx", "pkgdarwin", "port", "scoop", "script", "short", "whalebrew", "winget", "yay") SELECT "ansible", "appstore", "apt", "bin", "binary", "brew", "cargo", "cask", "choco", "desc", "docs", "edited", "gem", "github", "home", "id", "key", "name", "npm", "pacman", "pip", "pipx", "pkgdarwin", "port", "scoop", "script", "short", "whalebrew", "winget", "yay" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_key_key" ON "Application"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
