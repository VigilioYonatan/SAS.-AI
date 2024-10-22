import {
	type Input,
	minLength,
	number,
	string,
	nullable,
	array,
	maxLength,
	objectAsync,
	toTrimmed,
	object,
	boolean,
	minValue,
	maxValue,
} from "@vigilio/valibot";
import { filesSchema } from "@/uploads/schemas/uploads.schema";
import { productsImagesQualities } from "../libs";
import type { CategoriesSchema } from "./categories.schema";
import type { BrandsSchema } from "./brands.schema";
import type { OptionsSchema } from "./options/options.schema";
import type { VariantsSchema } from "./options/variants.schema";
import type { FeaturesSchema } from "./options/features.schema";

export const productsNormalSchema = objectAsync({
	id: number(),
	product_code: string([toTrimmed(), minLength(1), maxLength(30)]),
	name: string([toTrimmed(), minLength(1), minLength(3), maxLength(255)]),
	description: nullable(string([toTrimmed()])), // descripcion del producto
	characteristics: array(
		object({
			name: string([toTrimmed(), minLength(1)]),
			value: string([toTrimmed(), minLength(1)]),
		}),
	),
	enabled: boolean(), // esta disponible el producto?
	price: number([minValue(0)]), // precio
	discount: number([minValue(0), maxValue(100)]), //si tiene descuento
	slug: string([minLength(1), minLength(3), maxLength(255)]), // slug
	images: nullable(array(filesSchema(productsImagesQualities))),
	category_id: number(),
	brand_id: nullable(number()),
	url: nullable(string()),
	empresa_id: number(),
});

export type ProductsNormalSchema = Input<typeof productsNormalSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
export type ProductsNormalSchemaFromServer = ProductsNormalSchema & {
	category: CategoriesSchema;
	brand: Pick<BrandsSchema, "id" | "name">;
	options: (OptionsSchema & { features: FeaturesSchema[] })[];
	variants: (VariantsSchema & {
		features: { option_id: number; id: number }[];
	})[];
};
