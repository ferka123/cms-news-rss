/*
  Warnings:

  - You are about to drop the column `list_count` on the `Promo` table. All the data in the column will be lost.
  - You are about to drop the column `search_count` on the `Promo` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PromoPlacement" AS ENUM ('list', 'search', 'both');

-- AlterTable
ALTER TABLE "Promo" DROP COLUMN "list_count",
DROP COLUMN "search_count",
ADD COLUMN     "page_placement" "PromoPlacement" NOT NULL DEFAULT 'both';

-- CreateTable
CREATE TABLE "PromoSettings" (
    "id" SERIAL NOT NULL,
    "list_count" SMALLINT NOT NULL DEFAULT 0,
    "search_count" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "PromoSettings_pkey" PRIMARY KEY ("id")
);
