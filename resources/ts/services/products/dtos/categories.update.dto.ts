import { categoriesSchema } from "../schemas/categories.schema";
import { type Input, omit, pick } from "@vigilio/valibot";
import { categoriesStoreDto } from "./categories.store.dto";

export const categoriesUpdateDto = omit(categoriesSchema, [
	"id",
	"category_code",
	"empresa_id",
	"image",
	"wallpaper",
]);

export const categoriesUpdateImageDto = pick(categoriesStoreDto, ["image"]);
export const categoriesUpdateWallpaperDto = pick(categoriesStoreDto, [
	"wallpaper",
]);
export type CategoriesUpdateDto = Input<typeof categoriesUpdateDto>;
export type CategoriesUpdateImageDto = Input<typeof categoriesUpdateImageDto>;
export type CategoriesUpdateWallpaperDto = Input<
	typeof categoriesUpdateWallpaperDto
>;
