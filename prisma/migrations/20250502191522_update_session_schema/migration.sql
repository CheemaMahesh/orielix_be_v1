/*
  Warnings:

  - You are about to drop the column `eventImage` on the `Session` table. All the data in the column will be lost.
  - Added the required column `date` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "eventImage",
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "externalLink" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "type" TEXT,
ALTER COLUMN "createdBy" SET DATA TYPE TEXT;
