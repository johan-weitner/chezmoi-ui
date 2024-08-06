-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "edited" TEXT DEFAULT '',
    "desc" TEXT DEFAULT '',
    "bin" TEXT DEFAULT '',
    "short" TEXT DEFAULT '',
    "home" TEXT NOT NULL,
    "docs" TEXT DEFAULT '',
    "github" TEXT DEFAULT '',
    "whalebrew" TEXT DEFAULT '',
    "apt" TEXT DEFAULT '',
    "brew" TEXT DEFAULT '',
    "cask" TEXT DEFAULT '',
    "cargo" TEXT DEFAULT '',
    "npm" TEXT DEFAULT '',
    "pip" TEXT DEFAULT '',
    "pipx" TEXT DEFAULT '',
    "gem" TEXT DEFAULT '',
    "script" TEXT DEFAULT '',
    "choco" TEXT DEFAULT '',
    "scoop" TEXT DEFAULT '',
    "winget" TEXT DEFAULT '',
    "pkgdarwin" TEXT DEFAULT '',
    "ansible" TEXT DEFAULT '',
    "binary" TEXT DEFAULT '',
    "yay" TEXT DEFAULT '',
    "appstore" TEXT DEFAULT '',
    "pacman" TEXT DEFAULT '',
    "port" TEXT DEFAULT '',
    "done" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Application" ("ansible", "appstore", "apt", "bin", "binary", "brew", "cargo", "cask", "choco", "desc", "docs", "edited", "gem", "github", "home", "id", "key", "name", "npm", "pacman", "pip", "pipx", "pkgdarwin", "port", "scoop", "script", "short", "whalebrew", "winget", "yay") SELECT "ansible", "appstore", "apt", "bin", "binary", "brew", "cargo", "cask", "choco", "desc", "docs", "edited", "gem", "github", "home", "id", "key", "name", "npm", "pacman", "pip", "pipx", "pkgdarwin", "port", "scoop", "script", "short", "whalebrew", "winget", "yay" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_key_key" ON "Application"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
