import {
	type Input,
	omit,
	merge,
	object,
	array,
	instance,
	nullable,
} from "@vigilio/valibot";
import { categoriesSchema } from "../schemas/categories.schema";
import validFileValibot from "~/libs/valibot";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

export const categoriesStoreDto = merge([
	omit(categoriesSchema, ["id", "category_code", "image", "wallpaper"]),
	object({
		image: nullable(
			array(instance(File), [
				validFileValibot({
					required: true,
					min: 1,
					max: 1,
					types: [
						"image/jpg",
						"image/webp",
						"image/jpeg",
						"image/gif",
						"image/png",
						"video/mp4",
					],
				}),
			]),
		),
		wallpaper: nullable(
			array(instance(File), [
				validFileValibot({
					required: true,
					min: 1,
					max: 1,
					types: [
						"image/jpg",
						"image/webp",
						"image/jpeg",
						"image/gif",
						"image/png",
						"video/mp4",
					],
					maxSize: storageEmpresa?.isFreeVPS ? 25 : 50, //50mb
				}),
			]),
		),
	}),
]);

export type CategoriesStoreDto = Input<typeof categoriesStoreDto>;
