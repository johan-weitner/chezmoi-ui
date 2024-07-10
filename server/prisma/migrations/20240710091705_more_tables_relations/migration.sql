-- CreateTable
CREATE TABLE "Application" (
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
    "port" TEXT NOT NULL,
    "tags" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ApplicationTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "ApplicationTag_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ApplicationTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_key_key" ON "Application"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
