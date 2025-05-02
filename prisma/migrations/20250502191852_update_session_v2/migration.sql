/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Session_sessionId_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "sessionId",
ALTER COLUMN "isDeleted" DROP NOT NULL,
ALTER COLUMN "isActive" DROP NOT NULL;
