/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `App` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "App_key_key" ON "App"("key");
