import { ProductsNormalSchema } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchema } from "@/products/schemas/products_restaurant.schema";
import { ProductsServicioSchema } from "@/products/schemas/products_servicio.schema";
import {
    number,
    type Input,
    object,
    nullable,
    string,
    minLength,
    maxLength,
} from "@vigilio/valibot";

export const detailOrdersSchema = object({
    id: number(),
    quantity: number(),
    variante: nullable(string()),
    price: number(),
    order_id: number(),
    product_normal_id: nullable(number()),
    product_restaurant_id: nullable(number()),
    product_servicio_id: nullable(number()),
    variant_id: nullable(number()),
    empresa_id: number(),
    product_key: nullable(string([minLength(3), maxLength(30)])),
    coupon: nullable(string()),
});

export type DetailOrdersSchema = Input<typeof detailOrdersSchema>;
export type Products = {
    product_normal: ProductsNormalSchema | null;
    product_restaurant: ProductsRestaurantSchema | null;
    product_servicio: ProductsServicioSchema | null;
};
export type DetailOrdersSchemaFromServer = DetailOrdersSchema & Products;
