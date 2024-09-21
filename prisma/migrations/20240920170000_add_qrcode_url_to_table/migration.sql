/*
  Warnings:

  - Added the required column `qrCodeImageUrl` to the `Tables` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tables" ADD COLUMN     "qrCodeImageUrl" TEXT NOT NULL;
