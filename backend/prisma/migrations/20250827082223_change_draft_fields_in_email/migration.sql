/*
  Warnings:

  - You are about to drop the column `draftAttachments` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `draftBCC` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `draftCC` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `draftRecipients` on the `Email` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Attachment" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."BCCRecipient" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."CCRecipient" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Email" DROP COLUMN "draftAttachments",
DROP COLUMN "draftBCC",
DROP COLUMN "draftCC",
DROP COLUMN "draftRecipients";

-- AlterTable
ALTER TABLE "public"."Recipient" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false;
