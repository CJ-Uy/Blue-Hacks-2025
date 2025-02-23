/*
  Warnings:

  - You are about to drop the column `isAppropriate` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "isAppropriate",
ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT;
