/*
  Warnings:

  - Changed the type of `type` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('REPORT_CREATED', 'STATUS_CHANGED', 'COMMENT_ADDED', 'CLOSE_CONFIRMED', 'REPORT_IN_PROGRESS', 'REPORT_CLOSED');

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "type",
ADD COLUMN     "type" "ActivityType" NOT NULL;

-- DropEnum
DROP TYPE "Type";
