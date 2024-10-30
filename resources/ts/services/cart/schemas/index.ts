import { type VariantsSchema } from "@/products/schemas/options/variants.schema";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { ProductsServicioSchemaFromServer } from "@/products/schemas/products_servicio.schema";
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
    product_normal_id: nullable(number()),
    product_restaurant_id: nullable(number()),
    variant_id: nullable(number()),
    user_id: number(),
});
export type CartSchema = Input<typeof cartSchema>;

export type CartProductSchema = (
    | ProductsNormalSchemaFromServer
    | ProductsRestaurantSchemaFromServer
    | ProductsServicioSchemaFromServer
) & {
    quantity: number;
    subtotal: number;
    coupon: string | null;
    variant:
        | (VariantsSchema & {
              features: { option_id: number; id: number }[];
              totalSold: number;
          })
        | null;
};

export type CartSchemaFromServer = CartSchema & {
    product:
        | ProductsNormalSchemaFromServer
        | ProductsRestaurantSchemaFromServer;
};
