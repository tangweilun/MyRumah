/*
  Warnings:

  - A unique constraint covering the columns `[email,role]` on the table `UserInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_email_role_key" ON "UserInfo"("email", "role");
