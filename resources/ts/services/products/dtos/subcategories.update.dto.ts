import { type Input, omit, pick } from "@vigilio/valibot";
import { subcategoriesStoreDto } from "./subcategories.store.dto";
import { subcategoriesSchema } from "../schemas/subcategories.schema";

export const subcategoriesUpdateDto = omit(subcategoriesSchema, [
	"id",
	"subcategory_code",
	"image",
]);
export const subcategoriesUpdateImageDto = pick(subcategoriesStoreDto, [
	"image",
]);

export type SubcategoriesUpdateDto = Input<typeof subcategoriesUpdateDto>;
export type SubcategoriesUpdateImageDto = Input<
	typeof subcategoriesUpdateImageDto
>;
