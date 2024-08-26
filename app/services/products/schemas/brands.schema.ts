import { filesSchema } from "@/uploads/schemas/uploads.schema";
import {
    array,
    maxLength,
    minLength,
    number,
    objectAsync,
    string,
    type Input,
} from "@vigilio/valibot";
import { brandsImageQualities } from "../libs";

export const brandsSchema = objectAsync({
    id: number(),
    name: string([minLength(2), maxLength(100)]),
    brand_code: string(),
    image: array(filesSchema(brandsImageQualities)),
    slug: string([minLength(2), maxLength(100)]),
    information_id: number(),
});
export type BrandsSchema = Input<typeof brandsSchema>;
export type BrandsSchemaFromServe = BrandsSchema & {
    createdAt: Date;
    updatedAt: Date;
};
