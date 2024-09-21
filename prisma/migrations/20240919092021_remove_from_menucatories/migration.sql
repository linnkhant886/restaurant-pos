/*
  Warnings:

  - Made the column `companyId` on table `MenuCategories` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MenuCategories" DROP CONSTRAINT "MenuCategories_companyId_fkey";

-- AlterTable
ALTER TABLE "MenuCategories" ALTER COLUMN "companyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MenuCategories" ADD CONSTRAINT "MenuCategories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
