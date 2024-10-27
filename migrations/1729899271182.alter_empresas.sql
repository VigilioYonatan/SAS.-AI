-- 26/10/2024
ALTER TABLE "public"."CitasSettings"  ADD COLUMN "sendQuestionChunk" BOOLEAN DEFAULT false;
ALTER TABLE "CitasSettings" ADD "enabled"  BOOLEAN DEFAULT false;
ALTER TABLE "public"."Citas" ADD COLUMN "answers" JSON;
ALTER TABLE "public"."Citas" ADD COLUMN "telephone" VARCHAR(100);
ALTER TABLE "public"."Citas"
ALTER COLUMN "time" TYPE TIMESTAMP WITH TIME ZONE,
ALTER COLUMN "time" SET NOT NULL;