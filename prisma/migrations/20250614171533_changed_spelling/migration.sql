/*
  Warnings:

  - You are about to drop the column `catogory` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "catogory",
ADD COLUMN     "category" TEXT;
