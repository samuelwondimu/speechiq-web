/*
  Warnings:

  - The `status` column on the `PracticeSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PracticeSessionStatus" AS ENUM ('STARTED', 'UPLOADED', 'TRANSCRIBING', 'ANALYZING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "PracticeSession" DROP COLUMN "status",
ADD COLUMN     "status" "PracticeSessionStatus" NOT NULL DEFAULT 'UPLOADED';

-- DropEnum
DROP TYPE "SessionStatus";
