import {
    type Input,
    minLength,
    number,
    string,
    nullable,
    array,
    maxLength,
    toTrimmed,
    object,
    boolean,
    minValue,
    maxValue,
} from "@vigilio/valibot";
import type { CategoriesSchema } from "./categories.schema";
import { filesSchema } from "~/libs/upload";
import { SubcategoriesSchema } from "./subcategories.schema";

export const productsRestaurantSchema = object({
    id: number(),
    product_code: string([toTrimmed(), minLength(1), maxLength(30)]),
    name: string([toTrimmed(), minLength(1), minLength(3), maxLength(255)]),
    description: nullable(string([toTrimmed()])), // descripcion del producto
    characteristics: array(
        object({
            name: string([toTrimmed(), minLength(1)]),
            value: string([toTrimmed(), minLength(1)]),
        })
    ),
    enabled: boolean(), // esta disponible el producto?
    price: number([minValue(0)]), // precio
    stock: nullable(number([minValue(0, "Minimo 0 cantidades.")])),
    ilimit: boolean(),
    discount: number([minValue(0), maxValue(100)]), //si tiene descuento
    url: nullable(string()),
    slug: string([minLength(1), minLength(3), maxLength(255)]), // slug
    images: nullable(array(filesSchema())),
    subcategory_id: nullable(number()),
    shipping_free: boolean(),
    category_id: number(),
    empresa_id: number(),
});

export type ProductsRestaurantSchema = Input<
    typeof productsRestaurantSchema
> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export type ProductsRestaurantSchemaFromServer = ProductsRestaurantSchema & {
    category: CategoriesSchema;
    subcategory: SubcategoriesSchema;
    totalSold: number;
    rating: {
        quantity: number;
        promedio: number;
        ratings: { rating: number; percentage: number; length: number }[];
        stars5: number;
        stars4: number;
        stars3: number;
        stars2: number;
        stars1: number;
    };
    user: {
        isFavorite: boolean;
        rating: number;
    } | null;
};
