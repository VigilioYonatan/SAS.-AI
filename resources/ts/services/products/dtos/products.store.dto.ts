import {
	type Input,
	array,
	instance,
	merge,
	object,
	omit,
	number,
	nullable,
	minLength,
} from "@vigilio/valibot";
import { productsSchema } from "../schemas/products.schema";
import { productsOptionsSchema } from "../schemas/options/products_options.schema";
import validFileValibot from "~/libs/valibot";

export const productsStoreDto = merge([
	omit(productsSchema, ["id", "product_code", "images"]),
	object({
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
		category_id: number("Este campo es obligatorio"),
		family_id: number("Este campo es obligatorio"),
		options: array(omit(productsOptionsSchema, ["product_id"]), [
			minLength(1, "Minimo una opcion"),
		]),
	}),
]);

export type ProductsStoreDto = Input<typeof productsStoreDto>;
