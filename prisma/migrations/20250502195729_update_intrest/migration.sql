/*
  Warnings:

  - Added the required column `userId` to the `Interest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interest" ADD COLUMN     "userId" TEXT NOT NULL;
