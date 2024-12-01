-- AlterTable
ALTER TABLE "_PropertyInfoToWishlist" ADD CONSTRAINT "_PropertyInfoToWishlist_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PropertyInfoToWishlist_AB_unique";
