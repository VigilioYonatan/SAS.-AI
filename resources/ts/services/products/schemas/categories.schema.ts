import { slug } from "@vigilio/express-core/helpers";
import {
    minLength,
    type Input,
    number,
    maxLength,
    string,
    transform,
    toTrimmed,
    object,
} from "@vigilio/valibot";

export const categoriesSchema = object({
    id: number(),
    category_code: string([minLength(1), maxLength(30)]),
    name: string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
    slug: transform(
        string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
        slug
    ),
    information_id: number(),
});

export type CategoriesSchema = Input<typeof categoriesSchema>;
export type CategoriesSchemaFromServer = CategoriesSchema & {
    createdAt: Date;
    updatedAt: Date;
};
