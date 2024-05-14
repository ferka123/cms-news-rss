/*
  Warnings:

  - Changed the type of `interval` on the `Rss` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Rss" DROP COLUMN "interval",
ADD COLUMN     "interval" INTEGER NOT NULL;
