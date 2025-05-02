/*
  Warnings:

  - You are about to drop the column `userId` on the `Interest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interest" DROP COLUMN "userId",
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;
