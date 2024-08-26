import { type VariantsSchema } from "@/products/schemas/options/variants.schema";
import {
	object,
	number,
	type Input,
	string,
	minValue,
	nullable,
} from "@vigilio/valibot";

export const cartSchema = object({
	quantity: number([minValue(1, "Minimo 1  cantidad")]),
	coupon: nullable(string()),
	user_id: number(),
	product_id: number(),
	variant_id: number(),
});
export type CartSchema = Input<typeof cartSchema>;

export type CartProductSchema = ProductsSchemaFromServer & {
	quantity: number;
	subtotal: number;
	coupon: string | null;
	variant: VariantsSchema & {
		features: { option_id: number; feature_id: number }[];
		totalSold: number;
		createdAt: Date;
		updatedAt: Date;
	};
};

export type CartSchemaFromServer = CartSchema & {
	product: ProductsSchemaFromServer;
};
