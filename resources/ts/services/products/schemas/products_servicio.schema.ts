import {
	type Input,
	minLength,
	number,
	string,
	nullable,
	array,
	maxLength,
	toTrimmed,
	boolean,
	minValue,
	maxValue,
	object,
} from "@vigilio/valibot";
import type { CategoriesSchema } from "./categories.schema";
import { filesSchema } from "~/libs/upload";

export const productsServicioSchema = object({
	id: number(),
	product_code: string([toTrimmed(), minLength(1), maxLength(30)]),
	name: string([toTrimmed(), minLength(1), minLength(3), maxLength(255)]),
	description: nullable(string([toTrimmed()])), // descripcion del producto
	enabled: boolean(), // esta disponible el producto?
	price: number([minValue(0)]), // precio
	discount: number([minValue(0), maxValue(100)]), //si tiene descuento
	days: number(),
	images: nullable(array(filesSchema())),
	url: nullable(string()),
	slug: string([minLength(1), minLength(3), maxLength(255)]), // slug
	category_id: number(),
	information_id: number(),
	characteristics: array(
		object({
			name: string([toTrimmed(), minLength(1)]),
			value: string([toTrimmed(), minLength(1)]),
		}),
	),
});

export type ProductsServicioSchema = Input<typeof productsServicioSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
export type ProductsServicioSchemaFromServer = ProductsServicioSchema & {
	category: CategoriesSchema;
};
