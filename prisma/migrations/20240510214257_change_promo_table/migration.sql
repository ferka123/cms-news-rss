/*
  Warnings:

  - You are about to drop the column `filter_tag_id` on the `Promo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Promo" DROP CONSTRAINT "Promo_filter_tag_id_fkey";

-- AlterTable
ALTER TABLE "Promo" DROP COLUMN "filter_tag_id",
ADD COLUMN     "list_filter" BOOLEAN NOT NULL DEFAULT false;
