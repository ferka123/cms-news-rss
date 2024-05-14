/*
  Warnings:

  - Added the required column `type` to the `FailedImport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FailedImportType" AS ENUM ('parsing', 'media_processing');

-- AlterTable
ALTER TABLE "FailedImport" ADD COLUMN     "type" "FailedImportType" NOT NULL;
