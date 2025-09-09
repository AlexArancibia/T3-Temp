/*
  Warnings:

  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_profiles" DROP CONSTRAINT "user_profiles_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "defaultRiskPercentage" DECIMAL(5,2) NOT NULL DEFAULT 1.00,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "language" "public"."Language" NOT NULL DEFAULT 'ES',
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "theme" "public"."Theme" NOT NULL DEFAULT 'AUTO',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- DropTable
DROP TABLE "public"."user_profiles";
