/*
  Warnings:

  - You are about to drop the column `interestName` on the `Interest` table. All the data in the column will be lost.
  - Added the required column `name` to the `Interest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interest" DROP COLUMN "interestName",
ADD COLUMN     "name" TEXT NOT NULL;
