import {
    maxLength,
    minLength,
    number,
    object,
    string,
    type Input,
} from "@vigilio/valibot";

export const brandsSchema = object({
    id: number(),
    name: string([minLength(2), maxLength(100)]),
    brand_code: string(),
    slug: string([minLength(2), maxLength(100)]),
    information_id: number(),
});
export type BrandsSchema = Input<typeof brandsSchema>;
export type BrandsSchemaFromServer = BrandsSchema & {
    createdAt: Date;
    updatedAt: Date;
};
