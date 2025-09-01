-- CreateEnum
CREATE TYPE "public"."Gradient" AS ENUM ('TEAL_BLUE', 'PURPLE_INDIGO', 'YELLOW_RED', 'PINK_PEACH', 'SKY_BLUE');

-- AlterTable
ALTER TABLE "public"."Board" ADD COLUMN     "background" "public"."Gradient" NOT NULL DEFAULT 'TEAL_BLUE';
