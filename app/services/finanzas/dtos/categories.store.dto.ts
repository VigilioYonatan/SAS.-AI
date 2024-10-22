import { omitAsync, type Input } from "@vigilio/valibot";
import { categoryFinanzasSchema } from "../schemas/tipo.schema";

export const categoriesFinanzasStoreDto = omitAsync(categoryFinanzasSchema, [
	"id",
	"empresa_id",
]);
export type CategoriesFinanzasStoreDto = Input<
	typeof categoriesFinanzasStoreDto
>;
