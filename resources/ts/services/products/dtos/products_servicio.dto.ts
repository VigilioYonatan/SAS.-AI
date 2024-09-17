import {
	array,
	type Input,
	instance,
	merge,
	nullable,
	object,
	omit,
} from "@vigilio/valibot";
import { productsServicioSchema } from "../schemas/products_servicio.schema";
import validFileValibot from "~/libs/valibot";
export const productsServicioStoreDto = merge([
	omit(productsServicioSchema, ["id", "product_code", "images"]),
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

export type ProductsServicioStoreDto = Input<typeof productsServicioStoreDto>;
export const productsServicioUpdateDto = omit(productsServicioSchema, [
	"id",
	"product_code",
	"images",
	"empresa_id",
]);

export type ProductsServicioUpdateDto = Input<typeof productsServicioUpdateDto>;
