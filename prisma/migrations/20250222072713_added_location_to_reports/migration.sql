/*
  Warnings:

  - Added the required column `lat` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lon` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lon" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL;
