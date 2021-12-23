-- AlterTable
ALTER TABLE "Publications" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Publications" ADD CONSTRAINT "Publications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
