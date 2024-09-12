import { filesSchema } from "@/uploads/schemas/uploads.schema";
import {
	array,
	maxLength,
	minLength,
	nullable,
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
	slug: string([minLength(2), maxLength(100)]),
	image: nullable(array(filesSchema(brandsImageQualities))),
	empresa_id: number(),
});
export type BrandsSchema = Input<typeof brandsSchema>;
export type BrandsSchemaFromServe = BrandsSchema & {
	createdAt: Date;
	updatedAt: Date;
};
