-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('tenant', 'owner');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('active', 'inactive', 'occupied', 'trash');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('pending', 'submitted', 'pending_returned', 'returned');

-- CreateEnum
CREATE TYPE "InitialFeeStatus" AS ENUM ('pending', 'submitted');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('pending', 'ongoing', 'completed', 'expired');

-- CreateEnum
CREATE TYPE "RentalFeeStatus" AS ENUM ('paid', 'pending');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('read', 'unread');

-- CreateTable
CREATE TABLE "UserInfo" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "wallet_amount" DECIMAL(10,2) NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "wishlist_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("wishlist_id")
);

-- CreateTable
CREATE TABLE "PropertyInfo" (
    "property_id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "images" BYTEA[],
    "description" TEXT NOT NULL,
    "occupant_num" INTEGER NOT NULL,
    "rental_fee" DECIMAL(10,2) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" "PropertyStatus" NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyInfo_pkey" PRIMARY KEY ("property_id")
);

-- CreateTable
CREATE TABLE "WishlistProperty" (
    "wishlist_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Proposal" (
    "proposal_id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "status" "ProposalStatus" NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("proposal_id")
);

-- CreateTable
CREATE TABLE "Agreement" (
    "agreement_id" SERIAL NOT NULL,
    "proposal_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "deposit" DECIMAL(10,2) NOT NULL,
    "deposit_status" "DepositStatus" NOT NULL,
    "init_rental_fee" DECIMAL(10,2) NOT NULL,
    "initial_fee_status" "InitialFeeStatus" NOT NULL,
    "tenant_signature" BOOLEAN NOT NULL,
    "owner_signature" BOOLEAN NOT NULL,
    "agreement_status" "AgreementStatus" NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("agreement_id")
);

-- CreateTable
CREATE TABLE "RentalFee" (
    "fee_id" SERIAL NOT NULL,
    "agreement_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "RentalFeeStatus" NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalFee_pkey" PRIMARY KEY ("fee_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notif_id" SERIAL NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notif_id")
);

-- CreateTable
CREATE TABLE "_PropertyInfoToWishlist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_email_role_key" ON "UserInfo"("email", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_user_id_key" ON "Wishlist"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistProperty_wishlist_id_property_id_key" ON "WishlistProperty"("wishlist_id", "property_id");

-- CreateIndex
CREATE UNIQUE INDEX "_PropertyInfoToWishlist_AB_unique" ON "_PropertyInfoToWishlist"("A", "B");

-- CreateIndex
CREATE INDEX "_PropertyInfoToWishlist_B_index" ON "_PropertyInfoToWishlist"("B");

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserInfo"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyInfo" ADD CONSTRAINT "PropertyInfo_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "UserInfo"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistProperty" ADD CONSTRAINT "WishlistProperty_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "PropertyInfo"("property_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistProperty" ADD CONSTRAINT "WishlistProperty_wishlist_id_fkey" FOREIGN KEY ("wishlist_id") REFERENCES "Wishlist"("wishlist_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "PropertyInfo"("property_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "UserInfo"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "Proposal"("proposal_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalFee" ADD CONSTRAINT "RentalFee_agreement_id_fkey" FOREIGN KEY ("agreement_id") REFERENCES "Agreement"("agreement_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "UserInfo"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyInfoToWishlist" ADD CONSTRAINT "_PropertyInfoToWishlist_A_fkey" FOREIGN KEY ("A") REFERENCES "PropertyInfo"("property_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyInfoToWishlist" ADD CONSTRAINT "_PropertyInfoToWishlist_B_fkey" FOREIGN KEY ("B") REFERENCES "Wishlist"("wishlist_id") ON DELETE CASCADE ON UPDATE CASCADE;
