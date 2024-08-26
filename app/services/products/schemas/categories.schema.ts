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
    array,
} from "@vigilio/valibot";
import { categoriesImageQualities } from "../libs";

export const categoriesSchema = objectAsync({
    id: number(),
    category_code: string([minLength(1), maxLength(30)]),
    name: string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
    image: array(filesSchema(categoriesImageQualities)),
    slug: transform(
        string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
        slug
    ),
    information_id: number(),
});

export type CategoriesSchema = Input<typeof categoriesSchema>;
export type CategoriesSchemaFromServe = CategoriesSchema & {
    createdAt: Date;
    updatedAt: Date;
};
