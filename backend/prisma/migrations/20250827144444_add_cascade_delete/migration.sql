-- DropForeignKey
ALTER TABLE "public"."Attachment" DROP CONSTRAINT "Attachment_emailId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BCCRecipient" DROP CONSTRAINT "BCCRecipient_emailId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CCRecipient" DROP CONSTRAINT "CCRecipient_emailId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Recipient" DROP CONSTRAINT "Recipient_emailId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "public"."Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Recipient" ADD CONSTRAINT "Recipient_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "public"."Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CCRecipient" ADD CONSTRAINT "CCRecipient_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "public"."Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BCCRecipient" ADD CONSTRAINT "BCCRecipient_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "public"."Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;
