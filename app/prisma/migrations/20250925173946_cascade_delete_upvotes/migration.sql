-- DropForeignKey
ALTER TABLE "public"."Upvote" DROP CONSTRAINT "Upvote_streamId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Upvote" ADD CONSTRAINT "Upvote_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "public"."Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
