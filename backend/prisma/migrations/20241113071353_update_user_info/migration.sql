/*
  Warnings:

  - A unique constraint covering the columns `[private_key]` on the table `UserInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `private_key` to the `UserInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserInfo" ADD COLUMN     "private_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_private_key_key" ON "UserInfo"("private_key");
