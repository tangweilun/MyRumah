/*
  Warnings:

  - Made the column `created_date` on table `PropertyInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PropertyInfo" ALTER COLUMN "created_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "Proposal" ALTER COLUMN "modified_date" DROP NOT NULL;
