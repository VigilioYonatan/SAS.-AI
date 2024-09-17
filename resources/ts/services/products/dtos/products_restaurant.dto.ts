import {
	array,
	type Input,
	instance,
	merge,
	nullable,
	object,
	omit,
} from "@vigilio/valibot";
import { productsRestaurantSchema } from "../schemas/products_restaurant.schema";
import validFileValibot from "~/libs/valibot";

export const productsRestaurantStoreDto = merge([
	omit(productsRestaurantSchema, ["id", "product_code", "images"]),
	object({
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

export type ProductsRestaurantStoreDto = Input<
	typeof productsRestaurantStoreDto
>;
export const productsRestaurantUpdateDto = omit(productsRestaurantSchema, [
	"id",
	"product_code",
	"images",
	"empresa_id",
]);

export type ProductsRestaurantUpdateDto = Input<
	typeof productsRestaurantUpdateDto
>;
