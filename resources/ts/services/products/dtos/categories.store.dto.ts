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

export const categoriesStoreDto = merge([
	omit(categoriesSchema, ["id", "category_code", "image"]),
	object({
		image: nullable(
			array(instance(File), [
				validFileValibot({
					required: true,
					min: 1,
					max: 1,
					types: [
						"image/webp",
						"image/jpg",
						"image/jpeg",
						"image/png",
						"image/gif",
					],
				}),
			]),
		),
	}),
]);

export type CategoriesStoreDto = Input<typeof categoriesStoreDto>;
