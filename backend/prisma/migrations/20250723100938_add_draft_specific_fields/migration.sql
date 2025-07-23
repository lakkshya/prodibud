-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "draftAttachments" JSONB,
ADD COLUMN     "draftBCC" JSONB,
ADD COLUMN     "draftCC" JSONB,
ADD COLUMN     "draftRecipients" JSONB;
