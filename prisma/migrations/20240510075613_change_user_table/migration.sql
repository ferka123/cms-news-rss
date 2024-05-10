/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[media_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('active', 'suspended');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "media_id" INTEGER,
ADD COLUMN     "state" "UserState" NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE UNIQUE INDEX "User_media_id_key" ON "User"("media_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
