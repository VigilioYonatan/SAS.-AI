-- 7/11/2024
-- ALTER TABLE "public"."CitasSettings"  ADD COLUMN "sendQuestionChunk" BOOLEAN DEFAULT false;
-- ALTER TABLE "CitasSettings" ADD "enabled"  BOOLEAN DEFAULT false;
-- ALTER TABLE "public"."Citas" ADD COLUMN "answers" JSON;
-- ALTER TABLE "public"."Citas" ADD COLUMN "telephone" VARCHAR(100);
-- ALTER TABLE "public"."Citas"
-- ALTER COLUMN "time" TYPE TIMESTAMP WITH TIME ZONE,
-- ALTER COLUMN "time" SET NOT NULL;
-- ALTER TABLE "public"."Categories"
-- ADD COLUMN "isService"  BOOLEAN ;


ALTER TABLE "public"."Settings" ADD COLUMN "bg_color_background" VARCHAR(60) DEFAULT '#FFFFFF';
ALTER TABLE "public"."Settings" ADD COLUMN "bg_color_footer" VARCHAR(60) DEFAULT '#FFFFFF';
ALTER TABLE "public"."Settings" ADD COLUMN "bg_color_paper" VARCHAR(60) DEFAULT '#F2F2F2';
ALTER TABLE "public"."Empresas" ADD COLUMN "google_tag_manager" VARCHAR(60) DEFAULT NULL;
ALTER TABLE "public"."Empresas" ADD COLUMN "facebook_pixel" VARCHAR(60) DEFAULT NULL;

ALTER TABLE "public"."Empresas" ADD COLUMN "enabled_address" BOOLEAN DEFAULT true;