/*
  Warnings:

  - You are about to drop the column `events` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "events";

-- CreateTable
CREATE TABLE "_EventJoinedUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventJoinedUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventJoinedUsers_B_index" ON "_EventJoinedUsers"("B");

-- AddForeignKey
ALTER TABLE "_EventJoinedUsers" ADD CONSTRAINT "_EventJoinedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventJoinedUsers" ADD CONSTRAINT "_EventJoinedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
