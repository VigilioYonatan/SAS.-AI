import {
	type Input,
	array,
	instance,
	object,
	omit,
	merge,
	number,
	nullable,
	minLength,
} from "@vigilio/valibot";
import { productsSchema } from "../schemas/products.schema";
import { productsOptionsSchema } from "../schemas/options/products_options.schema";
import validFileValibot from "~/libs/valibot";

export const productsUpdateDto = merge([
	omit(productsSchema, ["id", "product_code", "images"]),
	object({
		category_id: number(),
		family_id: number(),
		options: array(omit(productsOptionsSchema, ["product_id"]), [
			minLength(1, "Minimo 1 opcion"),
		]),
	}),
]);
export const productsUpdateImagesDto = object({
	images: nullable(
		array(instance(File), [
			validFileValibot({
				required: true,
				min: 1,
				max: 20,
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
});
export type ProductsUpdateDto = Input<typeof productsUpdateDto>;
export type ProductsUpdateImagesDto = Input<typeof productsUpdateImagesDto>;
