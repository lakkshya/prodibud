-- AlterTable
ALTER TABLE "BCCRecipient" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CCRecipient" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Recipient" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;
