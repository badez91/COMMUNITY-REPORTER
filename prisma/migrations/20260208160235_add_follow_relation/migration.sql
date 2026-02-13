/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `logitude` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Report` table. All the data in the column will be lost.
  - The `status` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReportUpdate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBadge` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ReportUpdate" DROP CONSTRAINT "ReportUpdate_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ReportUpdate" DROP CONSTRAINT "ReportUpdate_reportId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_userId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "imageUrl",
DROP COLUMN "latitude",
DROP COLUMN "logitude",
DROP COLUMN "updatedAt",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "Badge";

-- DropTable
DROP TABLE "ReportUpdate";

-- DropTable
DROP TABLE "UserBadge";
