/*
  Warnings:

  - Made the column `start_date` on table `PropertyInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_date` on table `PropertyInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PropertyInfo" ALTER COLUMN "start_date" SET NOT NULL,
ALTER COLUMN "end_date" SET NOT NULL;
