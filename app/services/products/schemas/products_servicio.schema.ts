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
    boolean,
    minValue,
    maxValue,
    object,
} from "@vigilio/valibot";
import { filesSchema } from "@/uploads/schemas/uploads.schema";
import { productsImagesQualities } from "../libs";
import type { CategoriesSchema } from "./categories.schema";

export const productsServicioSchema = objectAsync({
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
    discount: number([minValue(0), maxValue(100)]), //si tiene descuento
    images: nullable(array(filesSchema(productsImagesQualities))),
    url: nullable(string()),
    slug: string([minLength(1), minLength(3), maxLength(255)]), // slug
    category_id: number(),
    empresa_id: number(),
    days: array(
        object({
            days: number([minValue(1)]),
            cantidad: number([minValue(0.1)]),
            name: string([minLength(3)]),
        })
    ),
    showHorario: boolean(),
});

export type ProductsServicioSchema = Input<typeof productsServicioSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export type ProductsSchemaFromServer = ProductsServicioSchema & {
    category: CategoriesSchema;
};
