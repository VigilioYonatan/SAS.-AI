import { type Input, omitAsync } from "@vigilio/valibot";
import { categoriesSchema } from "../schemas/categories.schema";

export const categoriesUpdateDto = omitAsync(categoriesSchema, [
    "id",
    "category_code",
    "empresa_id",
    "image",
    "wallpaper",
]);

export type CategoriesUpdateDto = Input<typeof categoriesUpdateDto>;
