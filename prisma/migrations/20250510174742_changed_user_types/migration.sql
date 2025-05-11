/*
  Warnings:

  - The values [Admin,Customer,TA,SuperAdmin,Creator] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('admin', 'customer', 'ta', 'superadmin', 'creator', 'presenter');
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "UserType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userType" SET DEFAULT 'customer';
