import { filesSchema } from "@/uploads/schemas/uploads.schema";
import { slug } from "@vigilio/express-core/helpers";
import {
    minLength,
    type Input,
    objectAsync,
    number,
    maxLength,
    string,
    transform,
    toTrimmed,
    nullable,
    array,
    startsWith,
    boolean,
} from "@vigilio/valibot";
import { brandsImageQualities } from "../libs";

export const categoriesSchema = objectAsync({
    id: number(),
    category_code: string([minLength(1), maxLength(30)]),
    name: string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
    isService: boolean(),
    icon: nullable(
        string([
            toTrimmed(),
            minLength(1),
            minLength(3),
            maxLength(200),
            startsWith("<i class=", "Icono no válido"),
        ])
    ),
    slug: transform(
        string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
        slug
    ),
    image: nullable(array(filesSchema(brandsImageQualities))),
    empresa_id: number(),
});

export type CategoriesSchema = Input<typeof categoriesSchema>;
export type CategoriesSchemaFromServe = CategoriesSchema & {
    createdAt: Date;
    updatedAt: Date;
};
