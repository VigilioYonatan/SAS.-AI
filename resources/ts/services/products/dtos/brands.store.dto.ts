import {
	type Input,
	omit,
	merge,
	object,
	array,
	instance,
} from "@vigilio/valibot";
import validFileValibot from "~/libs/valibot";
import { brandsSchema } from "../schemas/brands.schema";

export const brandsStoreDto = merge([
	omit(brandsSchema, ["id", "brand_code", "image"]),
	object({
		image: array(instance(File), [
			validFileValibot({
				required: true,
				min: 1,
				max: 1,
				types: [
					"image/webp",
					"image/jpg",
					"image/jpeg",
					"image/png",
					"image/gif",
				],
			}),
		]),
	}),
]);
export type BrandsStoreDto = Input<typeof brandsStoreDto>;
