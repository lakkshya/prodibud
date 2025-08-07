/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Email` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `BCCRecipient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CCRecipient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Recipient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BCCRecipient" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CCRecipient" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "isDeleted",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Recipient" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
