-- AlterTable
ALTER TABLE "PropertyInfo" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Proposal" ALTER COLUMN "modified_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RentalFee" ALTER COLUMN "modified_date" DROP NOT NULL;
