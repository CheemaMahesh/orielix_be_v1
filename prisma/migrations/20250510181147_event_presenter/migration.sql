-- AlterTable
ALTER TABLE "event" ADD COLUMN     "presenterId" TEXT;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_presenterId_fkey" FOREIGN KEY ("presenterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
