import { categoriesSchema } from "../schemas/categories.schema";
import { type Input, omit, pick } from "@vigilio/valibot";
import { categoriesStoreDto } from "./categories.store.dto";

export const categoriesUpdateDto = omit(categoriesSchema, [
	"id",
	"category_code",
	"image",
]);
export const categoriesUpdateImageDto = pick(categoriesStoreDto, ["image"]);

export type CategoriesUpdateDto = Input<typeof categoriesUpdateDto>;
export type CategoriesUpdateImageDto = Input<typeof categoriesUpdateImageDto>;
