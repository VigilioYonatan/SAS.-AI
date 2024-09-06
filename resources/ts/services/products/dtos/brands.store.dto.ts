import {
	array,
	type Input,
	instance,
	merge,
	nullable,
	object,
	omit,
} from "@vigilio/valibot";
import { brandsSchema } from "../schemas/brands.schema";
import validFileValibot from "~/libs/valibot";

export const brandsStoreDto = merge([
	omit(brandsSchema, ["id", "brand_code"]),
	object({
		image: nullable(
			array(instance(File), [
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
		),
	}),
]);

export type BrandsStoreDto = Input<typeof brandsStoreDto>;
