import {
	type Input,
	omit,
	merge,
	object,
	array,
	nullable,
	instance,
	pick,
	minLength,
} from "@vigilio/valibot";
import { productsNormalSchema } from "../schemas/products_normal.schema";
import { productsOptionsSchema } from "../schemas/options/products_options.schema";
import validFileValibot from "~/libs/valibot";

export const productsNormalStoreDto = merge([
	omit(productsNormalSchema, ["id", "product_code", "images"]),
	object({
		options: array(
			omit(productsOptionsSchema, ["product_normal_id", "empresa_id"]),
			[minLength(1, "Minimo una opción")],
		),
		images: nullable(
			array(instance(File), [
				validFileValibot({
					required: true,
					min: 1,
					max: 12,
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
export const productsUpdateImagesDto = pick(productsNormalStoreDto, ["images"]);
export const productsNormalUpdateDto = merge([
	omit(productsNormalSchema, ["id", "product_code", "images", "empresa_id"]),
	object({
		options: array(
			omit(productsOptionsSchema, ["product_normal_id", "empresa_id"]),
		),
	}),
]);
export type ProductsNormalStoreDto = Input<typeof productsNormalStoreDto>;

export type ProductsNormalUpdateDto = Input<typeof productsNormalUpdateDto>;
export type ProductsUpdateImagesDto = Input<typeof productsUpdateImagesDto>;
