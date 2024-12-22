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

-- foreign
ALTER TABLE "public"."Banners"
ADD COLUMN "grid_banner_id" INTEGER;
ALTER TABLE "public"."Banners"
ADD CONSTRAINT "fk_grid_banner_id" FOREIGN KEY ("grid_banner_id")
REFERENCES "public"."GridBanners"("id")
ON DELETE SET NULL;

-- alter
ALTER TABLE "Carts" DROP CONSTRAINT "Carts_variant_id_fkey";
ALTER TABLE "Carts"
ADD CONSTRAINT "Carts_variant_id_fkey"
FOREIGN KEY ("variant_id") REFERENCES "Variants" ("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- convertir a null una columna si tuvo foreing not null
ALTER TABLE "Banners"
ALTER COLUMN grid_banner_id DROP NOT NULL;


-- eliminar constraint unique si deseas 
SELECT tc.constraint_name, tc.table_name, kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_name = 'subcategoriess'
--   ver si ess unique
  AND kcu.column_name IN ('slug', 'name'); 


DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'subcategories'  -- Especifica la tabla
        AND tc.constraint_type = 'UNIQUE'
        AND kcu.column_name = 'name'           -- Especifica la columna
        AND tc.table_schema = 'public'
    LOOP
        EXECUTE 'ALTER TABLE public.subcategories DROP CONSTRAINT ' || quote_ident(r.constraint_name) || ';';
    END LOOP;
END $$;
-------- END EXAMPLES --------------