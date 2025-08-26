-- AlterTable
ALTER TABLE "public"."Email" ADD COLUMN     "isSentPermanentlyDeleted" BOOLEAN NOT NULL DEFAULT false;
