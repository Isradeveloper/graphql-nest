-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastUpdateById" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lastUpdateById_fkey" FOREIGN KEY ("lastUpdateById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
