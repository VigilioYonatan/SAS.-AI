import { type Input, omitAsync } from "@vigilio/valibot";
import { subcategoriesSchema } from "../schemas/subcategories.schema";

export const subcategoriesUpdateDto = omitAsync(subcategoriesSchema, [
	"id",
	"subcategory_code",
	"image",
	"empresa_id",
]);

export type SubcategoriesUpdateDto = Input<typeof subcategoriesUpdateDto>;
