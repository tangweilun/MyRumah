/*
  Warnings:

  - You are about to drop the column `private_key` on the `UserInfo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserInfo_private_key_key";

-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "private_key";
