/*
  Warnings:

  - The values [IMAGE,TEXT,NEWS] on the enum `PromoType` will be removed. If these variants are still used in the database, this will fail.
  - The values [DELETED,HIDDEN,DRAFT,ACTIVE] on the enum `PubState` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN,AUTHOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PromoType_new" AS ENUM ('image', 'text', 'news');
ALTER TABLE "Promo" ALTER COLUMN "type" TYPE "PromoType_new" USING ("type"::text::"PromoType_new");
ALTER TYPE "PromoType" RENAME TO "PromoType_old";
ALTER TYPE "PromoType_new" RENAME TO "PromoType";
DROP TYPE "PromoType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PubState_new" AS ENUM ('active', 'deleted', 'hidden', 'draft');
ALTER TABLE "News" ALTER COLUMN "pub_state" DROP DEFAULT;
ALTER TABLE "News" ALTER COLUMN "pub_state" TYPE "PubState_new" USING ("pub_state"::text::"PubState_new");
ALTER TYPE "PubState" RENAME TO "PubState_old";
ALTER TYPE "PubState_new" RENAME TO "PubState";
DROP TYPE "PubState_old";
ALTER TABLE "News" ALTER COLUMN "pub_state" SET DEFAULT 'draft';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('admin', 'author');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'author';
COMMIT;

-- AlterTable
ALTER TABLE "News" ALTER COLUMN "pub_state" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'author';
