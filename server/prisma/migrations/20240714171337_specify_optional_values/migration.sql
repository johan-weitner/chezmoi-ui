-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "edited" TEXT,
    "desc" TEXT,
    "bin" TEXT,
    "short" TEXT,
    "home" TEXT NOT NULL,
    "docs" TEXT,
    "github" TEXT,
    "whalebrew" TEXT,
    "apt" TEXT,
    "brew" TEXT,
    "cask" TEXT,
    "cargo" TEXT,
    "npm" TEXT,
    "pip" TEXT,
    "pipx" TEXT,
    "gem" TEXT,
    "script" TEXT,
    "choco" TEXT,
    "scoop" TEXT,
    "winget" TEXT,
    "pkgdarwin" TEXT,
    "ansible" TEXT,
    "binary" TEXT,
    "yay" TEXT,
    "appstore" TEXT,
    "pacman" TEXT,
    "port" TEXT
);
INSERT INTO "new_Application" ("ansible", "appstore", "apt", "bin", "binary", "brew", "cargo", "cask", "choco", "desc", "docs", "edited", "gem", "github", "home", "id", "key", "name", "npm", "pacman", "pip", "pipx", "pkgdarwin", "port", "scoop", "script", "short", "whalebrew", "winget", "yay") SELECT "ansible", "appstore", "apt", "bin", "binary", "brew", "cargo", "cask", "choco", "desc", "docs", "edited", "gem", "github", "home", "id", "key", "name", "npm", "pacman", "pip", "pipx", "pkgdarwin", "port", "scoop", "script", "short", "whalebrew", "winget", "yay" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_key_key" ON "Application"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
