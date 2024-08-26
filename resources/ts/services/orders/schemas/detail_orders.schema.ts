import type { ProductsSchemaFromServer } from "@/products/schemas/products.schema";
import { number, type Input, object, nullable, string } from "@vigilio/valibot";

export const detailOrdersSchema = object({
	id: number(),
	quantity: number(),
	variante: string(),
	price: number(),
	order_id: number(),
	product_id: number(),
	variant_id: number(),
	coupon: nullable(string()),
});

export type DetailOrdersSchema = Input<typeof detailOrdersSchema>;
export type DetailOrdersSchemaFromServer = DetailOrdersSchema & {
	product: ProductsSchemaFromServer;
	createdAt: Date;
	updatedAt: Date;
};
