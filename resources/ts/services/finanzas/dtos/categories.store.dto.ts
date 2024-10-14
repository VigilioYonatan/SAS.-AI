import { omit, type Input } from "@vigilio/valibot";
import { categoryFinanzasSchema } from "../schemas/tipo.schema";

export const categoriesFinanzasStoreDto = omit(categoryFinanzasSchema, [
    "id",
    "empresa_id",
]);
export type CategoriesFinanzasStoreDto = Input<
    typeof categoriesFinanzasStoreDto
>;
