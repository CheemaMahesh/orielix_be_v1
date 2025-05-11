/*
  Warnings:

  - You are about to drop the column `sessions` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "presenterId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sessions";

-- CreateTable
CREATE TABLE "_SessionJoinedUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SessionJoinedUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SessionJoinedUsers_B_index" ON "_SessionJoinedUsers"("B");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_presenterId_fkey" FOREIGN KEY ("presenterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionJoinedUsers" ADD CONSTRAINT "_SessionJoinedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionJoinedUsers" ADD CONSTRAINT "_SessionJoinedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
