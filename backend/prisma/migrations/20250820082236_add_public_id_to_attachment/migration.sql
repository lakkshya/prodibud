/*
  Warnings:

  - Added the required column `publicId` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Attachment" ADD COLUMN     "publicId" TEXT NOT NULL;
