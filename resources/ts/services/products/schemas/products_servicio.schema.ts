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
    earning: nullable(number([minValue(0), maxValue(100)])), // ganancia de empresa. si producto cuesta 100soles. ganancia 30% ejemplo. 130soles mostrara. SI ES nullo tomará el 30% de information schema
    price: number([minValue(0)]), // precio
    discount: number([minValue(0), maxValue(100)]), //si tiene descuento
    months: number(),
    images: nullable(array(filesSchema())),
    slug: string([minLength(1), minLength(3), maxLength(255)]), // slug
    category_id: number(),
    information_id: number(),
});

export type ProductsServicioSchema = Input<typeof productsServicioSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export type ProductsSchemaFromServer = ProductsServicioSchema & {
    category: CategoriesSchema;
};
