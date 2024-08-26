import { type Input, number, object, array } from "@vigilio/valibot";

export const productsOptionsSchema = object({
    product_normal_id: number(),
    option_id: number(),
    features: array(number()),
    information_id: number(),
});
export type ProductsOptionsSchema = Input<typeof productsOptionsSchema>;
